import React from 'react';
import { Link } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';
import { useNavigate } from 'react-router';
const Login = () => {
    const { handleLogin, loading } = useAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await handleLogin({ email, password })
            navigate("/")
        } catch (error) {
            setError(error)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
            <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Welcome Back</h1>
                    <p className="text-gray-300">Enter your credentials to access your account</p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">Email Address</label>
                        <div className="relative">
                            <input value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">Password</label>
                        <div className="relative">
                            <input value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center text-gray-300 cursor-pointer">
                            <input type="checkbox" className="mr-2 rounded bg-white/10 border-white/20 text-purple-500 focus:ring-purple-500 focus:ring-offset-slate-900" />
                            Remember me
                        </label>
                        <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">Forgot password?</a>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                    >
                        Sign In
                    </button>

                    <div className="flex items-center my-4">
                        <div className="flex-grow border-t border-white/20"></div>
                        <span className="px-3 text-gray-400 text-sm">Or</span>
                        <div className="flex-grow border-t border-white/20"></div>
                    </div>

                    <a
                        href="http://localhost:3000/api/auth/google"
                        className="w-full flex items-center justify-center py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold rounded-xl shadow-sm transition-all duration-300"
                    >
                        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continue with Google
                    </a>
                </form>

                <p className="mt-8 text-center text-gray-400 text-sm">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
                        Create one now
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;