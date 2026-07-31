import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { API_BASE_URL } from '../../../config';

const Register = () => {
    const navigate = useNavigate();
    const { handleRegister, loading } = useAuth();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState('');

    const strengthScore = (() => {
        let s = 0;
        if (password.length >= 8) s++;
        if (/[A-Z]/.test(password)) s++;
        if (/[0-9]/.test(password)) s++;
        if (/[^A-Za-z0-9]/.test(password)) s++;
        return s;
    })();

    const strengthMeta = [
        null,
        { label: 'Weak', color: 'bg-red-400' },
        { label: 'Fair', color: 'bg-orange-400' },
        { label: 'Good', color: 'bg-yellow-400' },
        { label: 'Strong', color: 'bg-green-500' },
    ];

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        if (password !== confirm) return setError("Passwords don't match.");
        try {
            await handleRegister({ username, email, password });
            navigate('/');
        } catch (err) {
            setError(err?.message || 'Registration failed. Please try again.');
        }
    }

    const EyeIcon = ({ open }) => open
        ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        : <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" /></svg>;

    return (
        <div className="flex flex-col min-h-screen bg-[#f5f0eb] font-['Inter',sans-serif]">

            {/* ── Navbar ── */}
            <nav className="w-full flex items-center justify-between px-8 py-4 border-b border-[#e4dfd8] bg-[#f5f0eb] z-10">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 no-underline">
                    <div className="w-7 h-7 bg-[#1a1a1a] rounded-md flex items-center justify-center">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#fff" />
                        </svg>
                    </div>
                    <span className="text-[15px] font-semibold text-[#1a1a1a] tracking-tight">Flexoraa</span>
                </Link>

                {/* Nav links */}
                <div className="hidden md:flex items-center gap-6">
                    <Link to="/" className="text-[14px] text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors no-underline">Home</Link>
                    <a href="#" className="text-[14px] text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors">Features</a>
                    <a href="#" className="text-[14px] text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors">Pricing</a>
                </div>

                {/* CTA */}
                <div className="flex items-center gap-3">
                    <Link to="/login" className="text-[14px] text-[#1a1a1a] font-medium hover:opacity-70 transition-opacity no-underline">Sign in</Link>
                    <Link to="/register" className="text-[14px] font-semibold bg-[#1a1a1a] text-white px-4 py-2 rounded-lg hover:bg-[#333] transition-colors no-underline">Get started</Link>
                </div>
            </nav>

            {/* ── Body: Split Panel ── */}
            <div className="flex flex-1">

                {/* ── Left: Form Side ── */}
                <div className="hidden lg:block lg:w-[55%] relative p-6">
                    <div className="w-full h-full rounded-2xl overflow-hidden bg-[#e0dbd4] relative">
                        <video
                            className="w-full h-full object-cover"
                            src="https://ik.imagekit.io/wsp4q3lfu/Video%20Project%202.mp4"
                            autoPlay loop muted playsInline
                        />
                    </div>
                </div>
                {/* ── Right: Form Side ── */}
                <div className="flex flex-col justify-between w-full lg:w-[45%] px-10 py-10 lg:px-16">

                    {/* top spacer */}
                    <div />

                    {/* Center content */}
                    <div className="w-full max-w-[360px] mx-auto">

                        <h1 className="text-[2.5rem] font-bold text-[#1a1a1a] leading-tight tracking-tight mb-1">
                            Make Your Portfolio Webpage
                        </h1>
                        <p className="text-[18px] text-[#6b6b6b] mb-8">
                            Turn your resume into a stunning webpage
                        </p>

                        {/* Error */}
                        {error && (
                            <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 text-[13px] rounded-xl px-4 py-3 mb-5">
                                <svg className="mt-0.5 shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                    <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                {error}
                            </div>
                        )}

                        {/* Google */}
                        <a
                            href={`${API_BASE_URL}/api/auth/google`}
                            className="flex items-center justify-center gap-3 w-full border border-[#d4d0cb] rounded-lg py-2.5 text-[14px] font-medium text-[#1a1a1a] bg-white hover:bg-[#f0ece6] transition-colors mb-4"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Continue with Google
                        </a>

                        {/* Divider */}
                        <div className="flex items-center gap-3 my-4">
                            <div className="flex-1 h-px bg-[#d4d0cb]" />
                            <span className="text-[12px] text-[#9e9e9e] font-medium">OR</span>
                            <div className="flex-1 h-px bg-[#d4d0cb]" />
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-3">

                            {/* Name */}
                            <input
                                type="text"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                placeholder="Full name"
                                required
                                className="w-full border border-[#d4d0cb] rounded-lg px-4 py-2.5 text-[14px] text-[#1a1a1a] placeholder-[#a0a0a0] bg-white focus:outline-none focus:border-[#1a1a1a] transition-colors"
                            />

                            {/* Email */}
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="Email address"
                                required
                                className="w-full border border-[#d4d0cb] rounded-lg px-4 py-2.5 text-[14px] text-[#1a1a1a] placeholder-[#a0a0a0] bg-white focus:outline-none focus:border-[#1a1a1a] transition-colors"
                            />

                            {/* Password */}
                            <div>
                                <div className="relative">
                                    <input
                                        type={showPass ? 'text' : 'password'}
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder="Password"
                                        required
                                        className="w-full border border-[#d4d0cb] rounded-lg px-4 py-2.5 pr-11 text-[14px] text-[#1a1a1a] placeholder-[#a0a0a0] bg-white focus:outline-none focus:border-[#1a1a1a] transition-colors"
                                    />
                                    <button type="button" onClick={() => setShowPass(!showPass)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9e9e9e] hover:text-[#1a1a1a] transition-colors">
                                        <EyeIcon open={showPass} />
                                    </button>
                                </div>

                                {/* Strength meter */}
                                {password.length > 0 && (
                                    <div className="mt-2 flex items-center gap-2">
                                        <div className="flex gap-1 flex-1">
                                            {[1, 2, 3, 4].map(i => (
                                                <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= strengthScore ? strengthMeta[strengthScore]?.color : 'bg-[#d4d0cb]'}`} />
                                            ))}
                                        </div>
                                        <span className="text-[11px] text-[#6b6b6b] font-medium min-w-[36px] text-right">
                                            {strengthMeta[strengthScore]?.label}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Confirm password */}
                            <div className="relative">
                                <input
                                    type={showConfirm ? 'text' : 'password'}
                                    value={confirm}
                                    onChange={e => setConfirm(e.target.value)}
                                    placeholder="Confirm password"
                                    required
                                    className={`w-full border rounded-lg px-4 py-2.5 pr-11 text-[14px] text-[#1a1a1a] placeholder-[#a0a0a0] bg-white focus:outline-none transition-colors ${confirm && confirm !== password ? 'border-red-300 focus:border-red-400' : 'border-[#d4d0cb] focus:border-[#1a1a1a]'}`}
                                />
                                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9e9e9e] hover:text-[#1a1a1a] transition-colors">
                                    <EyeIcon open={showConfirm} />
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#1a1a1a] hover:bg-[#333] text-white text-[14px] font-semibold rounded-lg py-2.5 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 mt-1"
                            >
                                {loading ? (
                                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                                        <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                                    </svg>
                                ) : 'Create account'}
                            </button>
                        </form>

                        <p className="mt-4 text-center text-[13px] text-[#6b6b6b]">
                            Already have an account?{' '}
                            <Link to="/login" className="text-[#1a1a1a] font-semibold underline underline-offset-2 hover:opacity-70 transition-opacity">
                                Sign in
                            </Link>
                        </p>
                    </div>

                    {/* Footer */}
                    <p className="text-[12px] text-[#a0a0a0] text-center">
                        © 2025 Flexoraa. All rights reserved.
                    </p>
                </div>

            </div>{/* end split panel */}

        </div>
    );
};

export default Register;