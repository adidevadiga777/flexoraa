import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../features/auth/hooks/useAuth';

function Navbar({ onNewChat, onOpenChats }) {
    const { user, handleLogout } = useAuth();
    const [profileOpen, setProfileOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setProfileOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const initials = user
        ? (user.username || user.email || 'U').slice(0, 2).toUpperCase()
        : 'U';

    return (
        <nav className="w-full flex items-center justify-between px-6 sm:px-8 py-3.5 border-b border-[#e4dfd8] bg-[#f5f0eb] z-30 shrink-0">

            {/* Left: Logo */}
            <Link to="/" className="flex items-center gap-2 no-underline">
                <div className="w-7 h-7 bg-[#1a1a1a] rounded-md flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#fff" />
                    </svg>
                </div>
                <span className="text-[15px] font-semibold text-[#1a1a1a] tracking-tight">Flexoraa</span>
            </Link>

            {/* Right: New + Chats Buttons & Profile Avatar */}
            <div className="flex items-center gap-3">
                {onNewChat && (
                    <button
                        onClick={onNewChat}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#d4d0cb] bg-white text-[#1a1a1a] text-[13px] font-medium hover:bg-[#f0ece6] transition-colors cursor-pointer shadow-2xs"
                        title="Create a new portfolio from scratch"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <span>New</span>
                    </button>
                )}

                {onOpenChats && (
                    <button
                        onClick={onOpenChats}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#d4d0cb] bg-white text-[#1a1a1a] text-[13px] font-medium hover:bg-[#f0ece6] transition-colors cursor-pointer shadow-2xs"
                        title="View your portfolio chats"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>Chats</span>
                    </button>
                )}

                {/* Profile avatar with dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setProfileOpen((o) => !o)}
                        className="flex items-center gap-2 cursor-pointer border-none bg-transparent"
                    >
                        {/* Avatar circle */}
                        <div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center text-white text-[12px] font-bold select-none">
                            {initials}
                        </div>

                        {/* Chevron */}
                        <svg
                            width="14" height="14" viewBox="0 0 24 24" fill="none"
                            className={`text-[#6b6b6b] transition-transform ${profileOpen ? 'rotate-180' : ''}`}
                        >
                            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>

                    {/* Dropdown */}
                    {profileOpen && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-[#e4dfd8] rounded-xl shadow-lg overflow-hidden z-50">
                            {/* User info row */}
                            <div className="px-4 py-3 border-b border-[#f0ece6]">
                                <p className="text-[13px] font-semibold text-[#1a1a1a] truncate">
                                    {user?.username || 'User'}
                                </p>
                                <p className="text-[12px] text-[#9e9e9e] truncate">
                                    {user?.email || ''}
                                </p>
                            </div>

                            {/* Logout button */}
                            <button
                                onClick={() => { setProfileOpen(false); handleLogout(); }}
                                className="w-full flex items-center gap-2.5 px-4 py-3 text-[13px] text-[#e53e3e] font-medium hover:bg-red-50 transition-colors cursor-pointer border-none bg-transparent text-left"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    <polyline points="16,17 21,12 16,7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                Log out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
