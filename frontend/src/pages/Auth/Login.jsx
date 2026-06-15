import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogIn, Mail, Lock, Loader2, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const user = await login(email, password);
            // Solo mostramos éxito si login no lanzó error
            toast.success(`¡Bienvenido de nuevo, ${user.name}!`, {
                icon: '👋',
                style: {
                    borderRadius: '1rem',
                    background: '#1e293b',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.1)'
                }
            });
            if (user.role === 'ADMIN') navigate('/admin');
            else navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Credenciales incorrectas');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/5 blur-[120px] rounded-full" />

            <div className="w-full max-w-md relative">
                <div className="glass-panel p-8 md:p-10 shadow-2xl relative overflow-hidden group">
                    {/* Top accent line */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />

                    <div className="text-center mb-10">
                        <div className="inline-flex p-4 rounded-2xl bg-indigo-500/10 mb-6 relative group-hover:scale-110 transition-transform duration-500">
                            <LogIn className="w-8 h-8 text-indigo-400" />
                            <Sparkles className="w-4 h-4 text-emerald-400 absolute -top-1 -right-1 animate-pulse" />
                        </div>
                        <h1 className="text-3xl font-extrabold mb-2 bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent">
                            Lead Keeper
                        </h1>
                        <p className="text-slate-400 text-sm">Tu aliado inteligente en ventas inmobiliarias</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">
                                Correo Electrónico
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-indigo-400 text-slate-500 transition-colors">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    className="input-premium pl-12"
                                    placeholder="tu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">
                                Contraseña
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-indigo-400 text-slate-500 transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type="password"
                                    className="input-premium pl-12"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full group relative"
                        >
                            <div className="relative flex items-center justify-center">
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <span className="mr-2">Entrar al Panel</span>
                                        <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </>
                                )}
                            </div>
                        </button>
                    </form>

                    <div className="mt-8 text-center border-t border-white/5 pt-6">
                        <p className="text-slate-500 text-sm">
                            ¿No tienes cuenta?{' '}
                            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors">
                                Regístrate gratis
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Floating elements for depth */}
                <div className="hidden lg:block absolute -right-24 top-1/4 animate-float opacity-20">
                    <div className="p-4 glass-card rounded-2xl">
                        <div className="w-12 h-2 bg-indigo-500/30 rounded-full mb-2" />
                        <div className="w-8 h-2 bg-slate-500/20 rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
