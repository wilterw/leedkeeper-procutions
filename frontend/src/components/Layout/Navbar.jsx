import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Box, Menu, X, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4 md:px-8 md:py-6">
            <div className="max-w-7xl mx-auto flex justify-between items-center bg-slate-900/50 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-3 px-6 shadow-2xl">

                {/* Brand Identity */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl flex items-center justify-center shadow-xl shadow-brand-500/20 group-hover:rotate-12 transition-transform">
                        <Bot className="text-white" size={24} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-black tracking-tighter uppercase italic bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent leading-none">Lead Keeper</span>
                        <span className="hidden sm:block text-[10px] font-black uppercase tracking-[0.3em] text-brand-400 mt-1">Autonomous Agent</span>
                    </div>
                </Link>

                {/* Desktop Secure Auth Area */}
                <div className="hidden md:flex items-center gap-6">
                    {user ? (
                        <>
                            <div className="flex items-center gap-4 py-1.5 px-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors">
                                <div className="text-right">
                                    <div className="text-xs font-black text-white uppercase tracking-tighter leading-none mb-1">{user.name}</div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-brand-500">{user.role} ACCESS</div>
                                </div>
                                <div className="w-9 h-9 rounded-full border-2 border-brand-500/30 p-0.5 shadow-lg">
                                    <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center font-bold text-brand-400 text-xs text-center">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleLogout}
                                className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 transition-all text-slate-400"
                                aria-label="Desconectarse del sistema"
                            >
                                <LogOut size={20} />
                            </motion.button>
                        </>
                    ) : (
                        <div className="flex items-center gap-6">
                            <Link to="/login" className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-all">Entrar</Link>
                            <Link to="/register" className="bg-white text-slate-950 px-6 py-2.5 rounded-full text-xs font-black hover:scale-105 transition-transform active:scale-95 shadow-lg shadow-white/10">Registrar Terminal</Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden flex items-center gap-4">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-2 text-slate-300 hover:text-white"
                        aria-label="Menú"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="md:hidden mt-4 mx-2 glass-card p-6 overflow-hidden"
                    >
                        <div className="flex flex-col gap-6">
                            {user ? (
                                <>
                                    <div className="flex items-center gap-4 py-3 border-b border-white/5">
                                        <div className="w-12 h-12 rounded-full border-2 border-indigo-500/50 flex items-center justify-center font-black text-indigo-400 text-xl">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="text-lg font-black text-white leading-none">{user.name}</div>
                                            <div className="text-xs font-bold text-indigo-500 uppercase tracking-widest mt-1">{user.role} ACCESS</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 font-bold uppercase text-xs tracking-widest"
                                    >
                                        <LogOut size={18} /> Salir del Sistema
                                    </button>
                                </>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-center py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold uppercase text-xs tracking-widest">Entrar</Link>
                                    <Link to="/register" onClick={() => setIsMenuOpen(false)} className="btn-primary w-full text-center py-4 rounded-2xl text-xs">Registrar Terminal</Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
