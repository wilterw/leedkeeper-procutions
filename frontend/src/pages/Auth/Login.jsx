import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, ArrowRight, Loader2, Sparkles, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userData = await login(email, password);
            toast.success('Acceso Autorizado');

            // Redirección inteligente basada en rol
            if (userData.role === 'ADMIN') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (error) {
            toast.error(typeof error === 'string' ? error : 'Error de autenticación');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 relative overflow-hidden bg-slate-950">
            {/* Signature Element: Dynamic Aura */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse pointer-events-none"></div>
            <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card w-full max-w-md p-10 relative z-10 border-white/10 shadow-2xl shadow-indigo-500/5 bg-slate-900/60 backdrop-blur-3xl"
            >
                <div className="flex justify-center mb-10">
                    <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center shadow-2xl shadow-indigo-500/20 rotate-3 hover:rotate-0 transition-transform duration-500">
                        <ShieldCheck size={40} className="text-white" />
                    </div>
                </div>

                <div className="text-center mb-10">
                    <h2 className="text-4xl font-black mb-2 tracking-tighter uppercase italic">Bienvenido</h2>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Identificación de Operador Requerida</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email de Acceso</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={18} />
                            <input
                                type="email"
                                required
                                className="input-field pl-12 h-14 bg-slate-950/50 border-white/5 focus:border-indigo-500/30 text-sm"
                                placeholder="operador@leadkeeper.io"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center px-1">
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Código de Seguridad</label>
                            <Link to="#" className="text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:text-indigo-400 transition-colors">¿Olvido?</Link>
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={18} />
                            <input
                                type="password"
                                required
                                className="input-field pl-12 h-14 bg-slate-950/50 border-white/5 focus:border-indigo-500/30 text-sm"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full h-14 text-sm font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-xl shadow-indigo-500/20"
                    >
                        {loading ? <Loader2 className="animate-spin text-white" size={24} /> : (
                            <>
                                Acceder al Sistema <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-12 pt-8 border-t border-white/5 text-center">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                        ¿Nueva Inmobiliaria?{' '}
                        <Link to="/register" className="text-indigo-500 hover:text-indigo-400 transition-colors">
                            Crear Terminal de Agente
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
