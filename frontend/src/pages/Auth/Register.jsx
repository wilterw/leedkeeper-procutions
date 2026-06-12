import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { User, Mail, Lock, Building2, ArrowRight, Loader2, Sparkles, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        companyName: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const fingerprint = navigator.userAgent + window.screen.width;

            const response = await api.post('/auth/register', {
                ...formData,
                fingerprint
            });

            toast.success(response.data.message);
            navigate('/login');
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Error al registrarse';
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 relative overflow-hidden bg-slate-950 py-12">
            {/* Ambient Atmosphere */}
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full"></div>
            <div className="absolute top-0 right-0 w-full h-full opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card w-full max-w-2xl p-8 md:p-12 relative z-10 border-white/10 shadow-2xl bg-slate-900/60 backdrop-blur-3xl"
            >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                    <div className="space-y-4">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                            <Sparkles size={28} className="text-indigo-400" />
                        </div>
                        <h2 className="text-4xl font-black tracking-tighter uppercase italic">Nueva Terminal</h2>
                        <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Registro de Inmobiliaria Certificada</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Administrador</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={18} />
                                <input
                                    type="text"
                                    required
                                    className="input-field pl-12 h-14 bg-slate-950/50 border-white/5 focus:border-indigo-500/30 text-sm"
                                    placeholder="Juan Pérez"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nombre Inmobiliaria</label>
                            <div className="relative group">
                                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={18} />
                                <input
                                    type="text"
                                    required
                                    className="input-field pl-12 h-14 bg-slate-950/50 border-white/5 focus:border-indigo-500/30 text-sm"
                                    placeholder="Real Estate Econos"
                                    value={formData.companyName}
                                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Canal de Acceso (Email)</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={18} />
                            <input
                                type="email"
                                required
                                className="input-field pl-12 h-14 bg-slate-950/50 border-white/5 focus:border-indigo-500/30 text-sm"
                                placeholder="contacto@tuempresa.io"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Clave de Encriptación</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={18} />
                            <input
                                type="password"
                                required
                                minLength={8}
                                className="input-field pl-12 h-14 bg-slate-950/50 border-white/5 focus:border-indigo-500/30 text-sm"
                                placeholder="Seguridad nivel militar"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
                        <p className="text-[10px] text-slate-400 font-medium italic leading-relaxed">
                            * Al registrarte, solicitas una licencia demo de 7 días. Cada cuenta está sujeta a revisión técnica por el comando de administración central.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full h-16 text-sm font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 active:scale-[0.98] transition-all shadow-2xl shadow-indigo-500/20"
                    >
                        {loading ? <Loader2 className="animate-spin text-white" size={24} /> : (
                            <>
                                Inicializar Cuenta <ArrowRight size={22} className="opacity-60" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-12 text-center">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                        ¿Ya formas parte del ecosistema?{' '}
                        <Link to="/login" className="text-indigo-500 hover:text-indigo-400 transition-colors">
                            Acceso de Usuario
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
