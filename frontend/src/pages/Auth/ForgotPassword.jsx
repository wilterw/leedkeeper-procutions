import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Loader2, Send } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, { email });
            setSent(true);
            toast.success('Correo enviado si la cuenta existe');
        } catch (error) {
            toast.error('Error al procesar la solicitud');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-600/10 blur-[120px] rounded-full animate-glow" />

            <div className="w-full max-w-md relative">
                <Link to="/login" className="inline-flex items-center gap-2 text-slate-500 hover:text-white mb-8 transition-colors group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-bold">Volver al Login</span>
                </Link>

                <div className="glass-card p-10 shadow-2xl relative overflow-hidden">
                    <div className="text-center mb-10">
                        <div className="inline-flex p-4 rounded-2xl bg-brand-500/10 mb-6">
                            <Send className="w-8 h-8 text-brand-400" />
                        </div>
                        <h1 className="text-3xl font-extrabold mb-2 text-white">Recuperar Acceso</h1>
                        <p className="text-slate-400 text-sm">Te enviaremos un enlace para restablecer tu contraseña</p>
                    </div>

                    {!sent ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">
                                    Correo Electrónico
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-brand-400 text-slate-500 transition-colors">
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

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-premium w-full"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Enviar Enlace'}
                            </button>
                        </form>
                    ) : (
                        <div className="text-center p-6 bg-brand-500/5 border border-brand-500/20 rounded-3xl">
                            <p className="text-brand-300 font-medium mb-4">¡Enlace enviado!</p>
                            <p className="text-slate-400 text-sm mb-6">Revisa tu bandeja de entrada. Si no lo ves, comprueba la carpeta de spam.</p>
                            <button onClick={() => setSent(false)} className="text-xs font-bold text-slate-500 hover:text-white uppercase tracking-widest">
                                Intentar con otro correo
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
