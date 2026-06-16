import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserPlus, Mail, Lock, User, Loader2, Sparkles, Rocket, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await register(formData);
            toast.success('¡Inmobiliaria creada con éxito!', {
                icon: '🚀',
                style: {
                    borderRadius: '1rem',
                    background: '#020617',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.1)'
                }
            });
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al crear la cuenta');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-600/10 blur-[120px] rounded-full animate-glow" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-600/5 blur-[120px] rounded-full animate-glow" />

            <div className="w-full max-w-md relative">
                <div className="glass-card p-10 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-500 to-transparent opacity-50" />

                    <div className="text-center mb-8">
                        <div className="inline-flex p-4 rounded-2xl bg-accent-500/10 mb-6 group-hover:scale-110 transition-transform duration-500">
                            <Rocket className="w-8 h-8 text-accent-400" />
                        </div>
                        <h1 className="text-3xl font-extrabold mb-2 bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent">
                            Crea tu Inmobiliaria
                        </h1>
                        <p className="text-slate-400 text-sm">Comienza a automatizar tus leads hoy mismo</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Nombre Inmobiliaria</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-accent-400 text-slate-500 transition-colors">
                                    <User size={18} />
                                </div>
                                <input
                                    type="text"
                                    className="input-premium pl-12 focus:border-emerald-500/50 focus:ring-emerald-500/10"
                                    placeholder="Ej: Inmuebles Elite"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Correo Profesional</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-accent-400 text-slate-500 transition-colors">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    className="input-premium pl-12 focus:border-emerald-500/50 focus:ring-emerald-500/10"
                                    placeholder="admin@tuinmuebles.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Contraseña Segura</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-accent-400 text-slate-500 transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type="password"
                                    className="input-premium pl-12 focus:border-emerald-500/50 focus:ring-emerald-500/10"
                                    placeholder="Mínimo 8 caracteres"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 rounded-full overflow-hidden w-full group shadow-lg shadow-accent-500/25"
                            style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                        >
                            <div className="flex items-center justify-center">
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <span className="mr-2 uppercase tracking-[0.2em] text-[10px] font-black">Crear Cuenta Gratis</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </div>
                        </button>
                    </form>

                    <div className="mt-8 text-center border-t border-white/5 pt-6">
                        <p className="text-slate-500 text-sm font-medium">
                            ¿Ya tienes cuenta?{' '}
                            <Link to="/login" className="text-accent-400 hover:text-accent-300 font-bold transition-colors">
                                Inicia sesión aquí
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
