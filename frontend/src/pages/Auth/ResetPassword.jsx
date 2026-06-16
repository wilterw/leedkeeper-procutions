import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, Loader2, KeyRound, ArrowRight } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 text-center">
                <div className="glass-card p-10 max-w-md">
                    <h2 className="text-2xl font-black text-red-400 mb-4">Enlace Inválido</h2>
                    <p className="text-slate-400 mb-8">Este enlace de recuperación no es válido o ya ha expirado.</p>
                    <Link to="/login" className="btn-premium">Volver al Inicio</Link>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return toast.error('Las contraseñas no coinciden');
        }

        setLoading(true);
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/auth/reset-password`, {
                token,
                newPassword: password
            });
            toast.success('Contraseña actualizada correctamente');
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Error al restablecer la contraseña');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent-600/10 blur-[120px] rounded-full animate-glow" />

            <div className="w-full max-w-md relative">
                <div className="glass-card p-10 shadow-2xl relative overflow-hidden">
                    <div className="text-center mb-10">
                        <div className="inline-flex p-4 rounded-2xl bg-accent-500/10 mb-6">
                            <KeyRound className="w-8 h-8 text-accent-400" />
                        </div>
                        <h1 className="text-3xl font-extrabold mb-2 text-white">Nueva Contraseña</h1>
                        <p className="text-slate-400 text-sm">Ingresa tu nueva clave de acceso</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Nueva Contraseña</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type="password"
                                    className="input-premium pl-12 focus:border-accent-500/50"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={8}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Confirmar Contraseña</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type="password"
                                    className="input-premium pl-12 focus:border-accent-500/50"
                                    placeholder="Repite tu contraseña"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-accent-500 hover:bg-accent-600 text-white w-full py-4 rounded-full font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                <>
                                    <span>Actualizar Contraseña</span>
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
