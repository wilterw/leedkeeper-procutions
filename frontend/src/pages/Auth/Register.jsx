import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserPlus, Mail, Lock, User, Loader2, Sparkles, Rocket } from 'lucide-react';
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
                    background: '#1e293b',
                    color: '#fff',
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
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/5 blur-[120px] rounded-full" />

            <div className="w-full max-w-md relative">
                <div className="glass-panel p-8 md:p-10 shadow-2xl relative">
                    <div className="text-center mb-8">
                        <div className="inline-flex p-4 rounded-2xl bg-emerald-500/10 mb-6 group-hover:rotate-12 transition-transform duration-500">
                            <Rocket className="w-8 h-8 text-emerald-400" />
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
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-emerald-400 text-slate-500 transition-colors">
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
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-emerald-400 text-slate-500 transition-colors">
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
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-emerald-400 text-slate-500 transition-colors">
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
                            className="btn-primary w-full !bg-emerald-600 hover:!bg-emerald-500 shadow-emerald-500/20"
                        >
                            <div className="flex items-center justify-center">
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <span className="mr-2">Crear Cuenta Gratis</span>
                                        <Sparkles className="w-4 h-4" />
                                    </>
                                )}
                            </div>
                        </button>
                    </form>

                    <div className="mt-8 text-center border-t border-white/5 pt-6">
                        <p className="text-slate-500 text-sm">
                            ¿Ya tienes cuenta?{' '}
                            <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors">
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
