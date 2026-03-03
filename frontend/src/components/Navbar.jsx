import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function Navbar({ user, onLogout }) {
    const navigate = useNavigate()
    const [menuOpen, setMenuOpen] = useState(false)

    const handleLogout = () => {
        onLogout()
        navigate('/')
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass-card rounded-none border-x-0 border-t-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform">
                            R
                        </div>
                        <span className="text-lg font-bold gradient-text">ResumeForge</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-4">
                        {user ? (
                            <>
                                <span className="text-sm text-slate-400">
                                    Hey, <span className="text-indigo-400 font-medium">{user.name}</span>
                                </span>
                                <Link
                                    to="/dashboard"
                                    className="text-sm text-slate-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-sm text-slate-400 hover:text-red-400 transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-sm text-slate-300 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/5"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="btn-gradient text-sm !py-2 !px-5"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden text-slate-300 hover:text-white p-2"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {menuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile menu */}
                {menuOpen && (
                    <div className="md:hidden pb-4 animate-fade-in">
                        {user ? (
                            <div className="flex flex-col gap-2">
                                <span className="text-sm text-slate-400 px-3 py-2">
                                    Hey, <span className="text-indigo-400 font-medium">{user.name}</span>
                                </span>
                                <Link to="/dashboard" onClick={() => setMenuOpen(false)}
                                    className="text-sm text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5">
                                    Dashboard
                                </Link>
                                <button onClick={() => { handleLogout(); setMenuOpen(false); }}
                                    className="text-left text-sm text-slate-400 hover:text-red-400 px-3 py-2 rounded-lg hover:bg-white/5">
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <Link to="/login" onClick={() => setMenuOpen(false)}
                                    className="text-sm text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5">
                                    Login
                                </Link>
                                <Link to="/register" onClick={() => setMenuOpen(false)}
                                    className="btn-gradient text-sm text-center !py-2">
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    )
}
