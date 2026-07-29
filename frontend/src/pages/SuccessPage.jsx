import { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router';
import { Copy, Check, ExternalLink, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';

function SuccessPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const liveUrl = location.state?.liveUrl;
    const portfolio = location.state?.portfolio;

    const [copied, setCopied] = useState(false);

    // If accessed directly without state, redirect home
    if (!liveUrl) {
        return <Navigate to="/" replace />;
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(liveUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    const name = portfolio?.structuredData?.name || portfolio?.portfolioContent?.name || 'Your Portfolio';

    return (
        <div className="flex flex-col min-h-screen bg-[#f5f0eb] font-['Inter',sans-serif]">
            <Navbar
                onNewChat={() => navigate('/')}
                onOpenChats={() => navigate('/')}
            />

            {/* ── Body: Split Panel ── */}
            <div className="flex flex-1">
                <div className="justify-center mx-auto items-center w-full lg:w-[45%] my-auto">
                    <div />

                    {/* Center content */}
                    <div className="w-full max-w-[360px] mx-auto">

                        {/* Success icon */}
                        <div className="w-16 h-16 rounded-2xl bg-[#16a34a] text-white flex items-center justify-center mx-auto mb-8 shadow-md">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                <path d="M20 6L9 17l-5-5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>

                        <h1 className="text-[2.5rem] font-bold text-[#1a1a1a] leading-tight tracking-tight mb-2 text-center">
                            You're live! 🎉
                        </h1>
                        <p className="text-[16px] text-[#6b6b6b] mb-8 leading-relaxed text-center">
                            {name} is now live and shareable with the world.
                        </p>

                        {/* URL label */}
                        <p className="text-[11px] font-semibold text-[#9e9e9e] uppercase tracking-widest mb-2">Your Live URL</p>

                        {/* URL box + copy */}
                        <div className="flex items-center gap-2 bg-white border border-[#d4d0cb] rounded-xl px-4 py-3 mb-4 focus-within:border-[#1a1a1a] transition-colors">
                            <span className="flex-1 text-[13px] text-[#1a1a1a] font-mono truncate">{liveUrl}</span>
                            <button
                                onClick={handleCopy}
                                title="Copy link"
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all cursor-pointer border-none shrink-0 ${copied ? 'bg-[#16a34a] text-white' : 'bg-[#1a1a1a] text-white hover:bg-[#333]'
                                    }`}
                            >
                                {copied ? <Check size={13} /> : <Copy size={13} />}
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                        </div>

                        {/* Open live */}
                        <a
                            href={liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#16a34a] text-white text-[14px] font-bold no-underline hover:bg-[#15803d] transition-colors mb-3"
                        >
                            <ExternalLink size={15} />
                            Open My Portfolio
                        </a>

                        {/* Back to editor */}
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-[14px] font-medium text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors bg-transparent border border-[#d4d0cb] hover:border-[#1a1a1a] cursor-pointer"
                        >
                            <ArrowLeft size={14} />
                            Back to Editor
                        </button>
                    </div>

                    {/* Footer */}
                    <p className="text-[12px] text-[#a0a0a0] text-center">
                        © 2026 Flexoraa. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SuccessPage;
