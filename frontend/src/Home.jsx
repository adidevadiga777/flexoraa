import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, Minimize2, Globe, Copy, Check, Loader2 } from 'lucide-react';
import { templates } from './templates';
import Navbar from './components/Navbar';
import GeneratingIndicator from './components/GeneratingIndicator';
import { API_BASE_URL } from './config';

function Home() {
    const [resume, setResume] = useState(null);
    const [image, setImage] = useState(null);
    const [template, setTemplate] = useState('TemplateOne');
    const [chatInput, setChatInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [portfolio, setPortfolio] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [isFullscreenPreview, setIsFullscreenPreview] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [liveUrl, setLiveUrl] = useState(null);
    const [copied, setCopied] = useState(false);
    const [showTemplateModal, setShowTemplateModal] = useState(false);

    // Chats history state
    const [userPortfolios, setUserPortfolios] = useState([]);
    const [showChatsModal, setShowChatsModal] = useState(false);
    const [loadingChats, setLoadingChats] = useState(false);

    const resumeInputRef = useRef(null);
    const imageInputRef = useRef(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    useEffect(() => {
        // If redirected back from PaymentPage after successful payment,
        // use the paid portfolio data directly to show the live URL immediately
        if (location.state?.paidPortfolio) {
            const p = location.state.paidPortfolio;
            const url = location.state.liveUrl;
            setPortfolio(p);
            if (url) setLiveUrl(url);
            if (p.messages && p.messages.length > 0) {
                setMessages(p.messages);
            } else {
                setMessages([{ role: 'ai', text: '🎉 Your portfolio is now live! Here is your shareable link.' }]);
            }
            // Clear router state so a refresh doesn\'t re-apply it
            window.history.replaceState({}, '');
            return;
        }

        const fetchSavedPortfolio = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/portfolio/me`, {
                    credentials: 'include'
                });
                if (response.ok) {
                    const data = await response.json();
                    if (data.portfolio) {
                        setPortfolio(data.portfolio);
                        if (data.portfolio.isPublished && data.portfolio.slug) {
                            setLiveUrl(`${window.location.origin}/portfolio/${data.portfolio.slug}`);
                        }
                        if (data.portfolio.messages && data.portfolio.messages.length > 0) {
                            setMessages(data.portfolio.messages);
                        } else {
                            setMessages([{ role: 'ai', text: "Welcome back! Here's your saved portfolio. Tell me what you'd like to change." }]);
                        }
                    }
                }
            } catch (error) {
                console.error('Failed to load saved portfolio:', error);
            }
        };
        fetchSavedPortfolio();
    }, []);

    // Create a new portfolio webpage from beginning
    const handleNewPortfolio = () => {
        setPortfolio(null);
        setMessages([]);
        setResume(null);
        setImage(null);
        setLiveUrl(null);
        setChatInput('');
        setIsFullscreenPreview(false);
    };

    // Open Chats history modal and load all user portfolios
    const handleOpenChats = async () => {
        setShowChatsModal(true);
        setLoadingChats(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/portfolio/all`, {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setUserPortfolios(data.portfolios || []);
            }
        } catch (err) {
            console.error('Failed to fetch user portfolios:', err);
        } finally {
            setLoadingChats(false);
        }
    };

    const handleSelectPortfolioFromChats = (selectedPortfolio) => {
        setPortfolio(selectedPortfolio);
        if (selectedPortfolio.isPublished && selectedPortfolio.slug) {
            setLiveUrl(`${window.location.origin}/portfolio/${selectedPortfolio.slug}`);
        } else {
            setLiveUrl(null);
        }
        if (selectedPortfolio.messages && selectedPortfolio.messages.length > 0) {
            setMessages(selectedPortfolio.messages);
        } else {
            setMessages([{ role: 'ai', text: "Here's your portfolio! Tell me what you'd like to change." }]);
        }
        setShowChatsModal(false);
    };

    const handleDeletePortfolio = async (e, portfolioId) => {
        e.stopPropagation();
        if (!window.confirm('Are you sure you want to delete this portfolio chat?')) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/portfolio/${portfolioId}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (res.ok) {
                setUserPortfolios((prev) => prev.filter((p) => p._id !== portfolioId));
                if (portfolio && portfolio._id === portfolioId) {
                    handleNewPortfolio();
                }
            }
        } catch (err) {
            console.error('Failed to delete portfolio:', err);
        }
    };

    const handleSubmit = async (selectedTemplateOverride = template) => {
        if (!portfolio) {
            if (!resume || !image) return alert('Please attach both your resume and a photo');
            setLoading(true);
            const formData = new FormData();
            formData.append('resume', resume);
            formData.append('image', image);
            formData.append('selectedTemplate', selectedTemplateOverride);
            if (chatInput.trim()) {
                formData.append('instruction', chatInput.trim());
            }
            try {
                const response = await fetch(`${API_BASE_URL}/api/upload`, {
                    method: 'POST',
                    credentials: 'include',
                    body: formData
                });
                const data = await response.json();
                if (response.ok) {
                    setPortfolio(data.portfolio);
                    setChatInput('');
                    if (data.portfolio.isPublished && data.portfolio.slug) {
                        setLiveUrl(`${window.location.origin}/portfolio/${data.portfolio.slug}`);
                    }
                    if (data.portfolio.messages && data.portfolio.messages.length > 0) {
                        setMessages(data.portfolio.messages);
                    } else {
                        setMessages([{ role: 'ai', text: "Here's your portfolio! Tell me what you'd like to change." }]);
                    }
                } else {
                    alert(data.message || 'Generation failed');
                }
            } finally {
                setLoading(false);
            }
        } else {
            if (!chatInput.trim()) return;
            const userMessage = { role: 'user', text: chatInput };
            setMessages((prev) => [...prev, userMessage]);
            setChatInput('');
            setLoading(true);
            try {
                const response = await fetch(`${API_BASE_URL}/api/portfolio/${portfolio._id}/edit`, {
                    method: 'PATCH',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ instruction: userMessage.text })
                });
                const data = await response.json();
                if (response.ok) {
                    setPortfolio(data.portfolio);
                    if (data.portfolio.messages && data.portfolio.messages.length > 0) {
                        setMessages(data.portfolio.messages);
                    } else {
                        setMessages((prev) => [...prev, { role: 'ai', text: 'Updated! Check the preview.' }]);
                    }
                } else {
                    const errText = data.message || 'Sorry, that edit failed. Try again.';
                    setMessages((prev) => [...prev, { role: 'ai', text: errText }]);
                }
            } finally {
                setLoading(false);
            }
        }
    };

    const handleGoLive = () => {
        if (!portfolio) return;
        navigate('/payment', { state: { portfolio } });
    };

    const handleCopyLink = () => {
        if (!liveUrl) return;
        navigator.clipboard.writeText(liveUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const SelectedTemplate = portfolio ? (templates[portfolio.selectedTemplate] || templates.TemplateOne) : null;
    const showSplit = !!portfolio;
    const canSend = portfolio ? chatInput.trim().length > 0 : (resume && image);

    // When arrow button clicked: if no portfolio → open template modal; if portfolio → send chat
    const handleArrowClick = () => {
        if (!portfolio) {
            if (!resume || !image) return alert('Please attach both your resume and a photo');
            setShowTemplateModal(true);
        } else {
            handleSubmit();
        }
    };

    // Called from template modal after user picks a template
    const handleTemplateSelect = (key) => {
        setTemplate(key);
        setShowTemplateModal(false);
        handleSubmit(key);
    };

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-[#f5f0eb] font-['Inter',sans-serif]">
            <Navbar onNewChat={handleNewPortfolio} onOpenChats={handleOpenChats} />

            {/* ── Main split area ── */}
            <div className="flex flex-1 overflow-hidden">

                {/* ── CHAT PANEL ── */}
                <AnimatePresence>
                    {(!showSplit || !isFullscreenPreview) && (
                        <motion.div
                            initial={false}
                            animate={{ width: showSplit ? '50%' : '100%' }}
                            exit={{ width: 0, opacity: 0 }}
                            transition={{ duration: 0.35, ease: 'easeInOut' }}
                            className="flex flex-col overflow-hidden"
                            style={{ borderRight: showSplit ? '1px solid #e5e0d8' : 'none' }}
                        >
                            {/* Message log */}
                            <div className="flex-1 overflow-y-auto px-4 py-6">
                                {!portfolio && (
                                    <div className="flex flex-col items-center justify-center h-full text-center gap-4">
                                        <p className="text-[15px] text-[#9e9e9e] max-w-xs leading-relaxed">
                                            Attach your resume + photo below, then hit the arrow to generate your portfolio
                                        </p>
                                    </div>
                                )}

                                {/* Messages */}
                                <div className="max-w-2xl mx-auto space-y-5">
                                    {messages.map((msg, i) => (
                                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            {msg.role === 'ai' && (
                                                <div className="w-7 h-7 rounded-full bg-[#1a1a1a] flex items-center justify-center mr-2.5 mt-0.5 shrink-0">
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#fff" />
                                                    </svg>
                                                </div>
                                            )}
                                            <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-[14px] leading-relaxed ${msg.role === 'user'
                                                ? 'bg-[#1a1a1a] text-white rounded-br-sm'
                                                : 'bg-white border border-[#e5e0d8] text-[#1a1a1a] rounded-bl-sm shadow-sm'
                                            }`}>
                                                {msg.text}
                                            </div>
                                        </div>
                                    ))}

                                    {/* Inline generating indicator */}
                                    {loading && (
                                        <div className="flex justify-start">
                                            <div className="w-7 h-7 rounded-full bg-[#1a1a1a] flex items-center justify-center mr-2.5 mt-0.5 shrink-0">
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#fff" />
                                                </svg>
                                            </div>
                                            <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-white border border-[#e5e0d8] shadow-sm">
                                                <GeneratingIndicator />
                                            </div>
                                        </div>
                                    )}

                                    <div ref={messagesEndRef} />
                                </div>
                            </div>

                            {/* ── Claude-style input bar ── */}
                            <div className="px-4 pb-5 pt-2">
                                <div className="max-w-2xl mx-auto">
                                    <div className="bg-white border border-[#d4d0cb] rounded-2xl shadow-sm overflow-hidden focus-within:border-[#1a1a1a] transition-colors">

                                        {/* Text area */}
                                        <textarea
                                            value={chatInput}
                                            onChange={(e) => setChatInput(e.target.value)}
                                            placeholder={portfolio ? 'Ask me to change something…' : 'Describe any extra details (optional)…'}
                                            disabled={loading}
                                            rows={2}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey && !loading) {
                                                    e.preventDefault();
                                                    if (!portfolio) {
                                                        handleArrowClick();
                                                    } else {
                                                        handleSubmit();
                                                    }
                                                }
                                            }}
                                            className="w-full px-4 pt-3.5 pb-2 text-[14px] text-[#1a1a1a] placeholder-[#b0a89f] bg-transparent border-none outline-none resize-none"
                                        />

                                        {/* Bottom action row */}
                                        <div className="flex items-center justify-between px-3 pb-3 pt-1 gap-2">

                                            {/* Left: attachment pills only */}
                                            <div className="flex items-center gap-2 flex-wrap">
                                                {!portfolio && (
                                                    <>
                                                        {/* Resume pill */}
                                                        <label
                                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium border transition-colors cursor-pointer ${resume ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]' : 'bg-[#f5f0eb] text-[#6b6b6b] border-[#d4d0cb] hover:border-[#1a1a1a] hover:text-[#1a1a1a]'}`}
                                                        >
                                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                                                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                                <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                            </svg>
                                                            {resume ? resume.name.slice(0, 14) + (resume.name.length > 14 ? '…' : '') : 'Resume'}
                                                            <input type="file" accept="application/pdf,.pdf" className="hidden"
                                                                onChange={(e) => e.target.files?.[0] && setResume(e.target.files[0])} />
                                                        </label>

                                                        {/* Photo pill */}
                                                        <label
                                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium border transition-colors cursor-pointer ${image ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]' : 'bg-[#f5f0eb] text-[#6b6b6b] border-[#d4d0cb] hover:border-[#1a1a1a] hover:text-[#1a1a1a]'}`}
                                                        >
                                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                                                                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                                                                <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                                                                <polyline points="21,15 16,10 5,21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                            {image ? image.name.slice(0, 14) + (image.name.length > 14 ? '…' : '') : 'Photo'}
                                                            <input type="file" accept="image/*,.heic,.heif,.png,.jpg,.jpeg,.webp" className="hidden"
                                                                onChange={(e) => e.target.files?.[0] && setImage(e.target.files[0])} />
                                                        </label>
                                                    </>
                                                )}
                                            </div>

                                            {/* Right: arrow send button */}
                                            <button
                                                onClick={handleArrowClick}
                                                disabled={loading || !canSend}
                                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all shrink-0 ${canSend && !loading
                                                    ? 'bg-[#1a1a1a] text-white hover:bg-[#333] cursor-pointer'
                                                    : 'bg-[#e5e0d8] text-[#b0a89f] cursor-not-allowed'
                                                }`}
                                            >
                                                {/* Up arrow */}
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                                    <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    <p className="text-center text-[11px] text-[#c0b8b0] mt-2">
                                        Flexoraa can make mistakes. Please review your portfolio before publishing.
                                    </p>
                                </div>
                            </div>

                            {/* ── Template selection modal ── */}
                            <AnimatePresence>
                                {showTemplateModal && (
                                    <>
                                        {/* Backdrop */}
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            onClick={() => setShowTemplateModal(false)}
                                            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
                                        />
                                        {/* Modal card */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 20, scale: 0.96 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 20, scale: 0.96 }}
                                            transition={{ duration: 0.2 }}
                                            className="fixed z-50 bottom-32 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-white rounded-2xl border border-[#e4dfd8] shadow-xl p-5"
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <h3 className="text-[15px] font-semibold text-[#1a1a1a]">Choose a template</h3>
                                                <button onClick={() => setShowTemplateModal(false)}
                                                    className="text-[#9e9e9e] hover:text-[#1a1a1a] transition-colors cursor-pointer border-none bg-transparent text-lg leading-none">✕</button>
                                            </div>
                                            <p className="text-[13px] text-[#9e9e9e] mb-4">Select a style, then we'll generate your portfolio.</p>
                                            <div className="grid grid-cols-2 gap-3">
                                                {[
                                                    { key: 'TemplateOne', label: 'Classic', desc: 'Clean & traditional' },
                                                    { key: 'TemplateTwo', label: 'Modern', desc: 'Bold & contemporary' },
                                                ].map((t) => (
                                                    <button
                                                        key={t.key}
                                                        onClick={() => handleTemplateSelect(t.key)}
                                                        className={`flex flex-col items-start gap-1 p-4 rounded-xl border-2 text-left transition-all cursor-pointer w-full ${
                                                            template === t.key
                                                                ? 'border-[#1a1a1a] bg-[#1a1a1a] text-white'
                                                                : 'border-[#d4d0cb] bg-[#f5f0eb] text-[#1a1a1a] hover:border-[#1a1a1a]'
                                                        }`}
                                                    >
                                                        <span className="text-[14px] font-semibold">{t.label}</span>
                                                        <span className={`text-[12px] ${template === t.key ? 'text-white/70' : 'text-[#9e9e9e]'}`}>{t.desc}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── PREVIEW PANEL ── */}
                {showSplit && (
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: isFullscreenPreview ? '100%' : '50%', opacity: 1 }}
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                        className="flex flex-col bg-[#f8fafc] relative overflow-hidden"
                    >
                        {/* Preview toolbar */}
                        <div className="flex items-center justify-between px-4 py-2 bg-[#1e293b] border-b border-[#334155] shrink-0 gap-3 z-50">
                            <div className="flex-1 bg-[#0f172a] rounded-md px-3 py-1.5 text-[11px] text-[#94a3b8] font-mono overflow-hidden text-ellipsis whitespace-nowrap">
                                {liveUrl ? liveUrl : 'Preview mode — not yet published'}
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                {liveUrl && (
                                    <button onClick={handleCopyLink}
                                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] border cursor-pointer ${copied ? 'bg-[#166534] text-[#bbf7d0] border-[#166534]' : 'bg-[#1e3a5f] text-[#93c5fd] border-[#1e40af]'}`}>
                                        {copied ? <Check size={12} /> : <Copy size={12} />}
                                        {copied ? 'Copied!' : 'Copy Link'}
                                    </button>
                                )}
                                {liveUrl ? (
                                    <a href={liveUrl} target="_blank" rel="noreferrer"
                                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] bg-[#16a34a] text-white font-semibold no-underline">
                                        <Globe size={12} /> Open Live
                                    </a>
                                ) : (
                                    <button onClick={handleGoLive}
                                        className="flex items-center gap-1 px-3 py-1.5 rounded-md text-[11px] bg-[#16a34a] text-white font-bold border-none cursor-pointer">
                                        <Globe size={12} /> Go Live
                                    </button>
                                )}
                                <button onClick={() => setIsFullscreenPreview((p) => !p)}
                                    className="flex items-center bg-white/10 text-white border-none rounded-md p-1.5 cursor-pointer">
                                    {isFullscreenPreview ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                                </button>
                            </div>
                        </div>

                        {/* Template preview */}
                        <div className="flex-1 overflow-y-auto">
                            <SelectedTemplate
                                key={portfolio._id + '-' + JSON.stringify(portfolio.portfolioContent) + '-' + portfolio.selectedTemplate}
                                portfolio={portfolio}
                            />
                        </div>
                    </motion.div>
                )}
            </div>

            {/* ── Chats History Modal ── */}
            <AnimatePresence>
                {showChatsModal && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowChatsModal(false)}
                            className="fixed inset-0 z-40 bg-black/25 backdrop-blur-xs"
                        />
                        {/* Modal card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-lg bg-white rounded-2xl border border-[#e4dfd8] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0ece6] bg-[#f9f7f4]">
                                <div>
                                    <h3 className="text-[16px] font-bold text-[#1a1a1a]">Your Portfolio Chats</h3>
                                    <p className="text-[12px] text-[#8e8e8e]">Switch between your saved portfolio projects</p>
                                </div>
                                <button
                                    onClick={() => setShowChatsModal(false)}
                                    className="text-[#9e9e9e] hover:text-[#1a1a1a] transition-colors cursor-pointer border-none bg-transparent text-xl leading-none"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Content Body */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
                                {loadingChats ? (
                                    <div className="py-12 text-center text-[14px] text-[#9e9e9e] flex items-center justify-center gap-2">
                                        <Loader2 className="animate-spin w-5 h-5 text-[#1a1a1a]" />
                                        Loading chats...
                                    </div>
                                ) : userPortfolios.length === 0 ? (
                                    <div className="py-12 text-center text-[#9e9e9e] space-y-2">
                                        <p className="text-[14px] font-medium text-[#1a1a1a]">No previous chats found</p>
                                        <p className="text-[12px]">Click 'New' in the navbar to start a new portfolio!</p>
                                    </div>
                                ) : (
                                    userPortfolios.map((item) => {
                                        const isCurrent = portfolio && portfolio._id === item._id;
                                        const title = item.structuredData?.name || item.portfolioContent?.name || 'Portfolio Project';
                                        const lastMsg = item.messages?.[item.messages.length - 1]?.text || 'Portfolio created';
                                        const dateStr = item.createdAt ? new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '';

                                        return (
                                            <div
                                                key={item._id}
                                                onClick={() => handleSelectPortfolioFromChats(item)}
                                                className={`group flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                                                    isCurrent
                                                        ? 'border-[#1a1a1a] bg-[#1a1a1a] text-white shadow-xs'
                                                        : 'border-[#e4dfd8] bg-[#faf8f5] hover:border-[#1a1a1a] text-[#1a1a1a]'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3.5 min-w-0 flex-1 pr-3">
                                                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                                                        isCurrent ? 'bg-white/15 text-white' : 'bg-[#e5e0d8] text-[#1a1a1a]'
                                                    }`}>
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center gap-2 mb-0.5">
                                                            <span className="font-semibold text-[14px] truncate">{title}</span>
                                                            {isCurrent && (
                                                                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-white/20 text-white">Active</span>
                                                            )}
                                                            {item.isPublished && (
                                                                <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                                                                    isCurrent ? 'bg-green-500/30 text-green-200' : 'bg-green-100 text-green-700'
                                                                }`}>Live</span>
                                                            )}
                                                        </div>
                                                        <p className={`text-[12px] truncate ${isCurrent ? 'text-white/70' : 'text-[#8e8e8e]'}`}>
                                                            {lastMsg}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3 shrink-0">
                                                    <span className={`text-[11px] ${isCurrent ? 'text-white/60' : 'text-[#a0a0a0]'}`}>
                                                        {dateStr}
                                                    </span>
                                                    <button
                                                        onClick={(e) => handleDeletePortfolio(e, item._id)}
                                                        className={`p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity border-none bg-transparent cursor-pointer ${
                                                            isCurrent ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-[#a0a0a0] hover:text-red-600 hover:bg-red-50'
                                                        }`}
                                                        title="Delete chat"
                                                    >
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                                            <polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

export default Home;