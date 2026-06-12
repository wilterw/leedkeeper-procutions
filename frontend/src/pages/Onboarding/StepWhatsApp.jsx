import React, { useState, useEffect } from 'react';
import { QrCode, RefreshCcw, CheckCircle2, ChevronLeft, Loader2, MessageSquare, Smartphone, Zap, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

const StepWhatsApp = ({ onNext, onPrev }) => {
    const navigate = useNavigate();
    const [qr, setQr] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, qr, connected
    const [instanceName, setInstanceName] = useState('');

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setInstanceName(`leadkeeper_${storedUser.inmobiliariaId}`);
        }
    }, []);

    const fetchQR = async () => {
        setStatus('loading');
        try {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            const inmobiliariaId = storedUser?.inmobiliariaId || storedUser?.id;

            const response = await api.post('/whatsapp/connect', { inmobiliariaId });
            if (response.data.qrcode) {
                setQr(response.data.qrcode);
                setInstanceName(response.data.instanceName);
                setStatus('qr');
                startPolling(response.data.instanceName);
            }
        } catch (e) {
            console.error('Error de sync:', e);
            const errorMsg = e.response?.data?.error || e.message;
            toast.error(`Error de Servidor: ${errorMsg}`);
            setStatus('idle');
        }
    };

    const startPolling = (targetInstance) => {
        const interval = setInterval(async () => {
            try {
                const response = await api.get(`/whatsapp/status/${targetInstance}`);
                if (response.data.state === 'open') {
                    setStatus('connected');
                    clearInterval(interval);
                    toast.success('Protocolo de comunicación establecido');
                    setTimeout(onNext, 2000);
                }
            } catch (e) {
                console.log('Pulse check failed...');
            }
        }, 5000);

        return () => clearInterval(interval);
    };

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-2xl shrink-0">
                    <Smartphone className="text-indigo-400" size={32} />
                </div>
                <div>
                    <h3 className="text-3xl font-black tracking-tight uppercase italic">Canal de Enlace</h3>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Vinculación Segura de WhatsApp</p>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center p-8 md:p-14 bg-slate-950/50 rounded-[2.5rem] border border-white/5 relative min-h-[450px] shadow-inner overflow-hidden">
                {/* Visual Grid Background */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

                <AnimatePresence mode="wait">
                    {status === 'idle' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center space-y-8 relative z-10">
                            <p className="text-slate-400 text-sm max-w-sm font-medium">Escanea el código QR generado para autorizar al Agente IA a gestionar tus conversaciones.</p>
                            <button onClick={fetchQR} className="btn-primary px-12 py-5 font-black text-sm uppercase tracking-widest active:scale-95 transition-all">
                                Inicializar Sincronización
                            </button>
                        </motion.div>
                    )}

                    {status === 'loading' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center space-y-6 relative z-10">
                            <div className="relative">
                                <Loader2 className="animate-spin mx-auto text-indigo-500" size={64} strokeWidth={1} />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Zap size={20} className="text-cyan-400 animate-pulse" />
                                </div>
                            </div>
                            <p className="text-indigo-400 font-black uppercase tracking-[0.3em] text-[10px]">Cifrando Instancia remota...</p>
                        </motion.div>
                    )}

                    {status === 'qr' && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center space-y-8 relative z-10">
                            <div className="relative inline-block pb-4">
                                <div className="absolute -inset-4 bg-indigo-500/10 blur-[40px] rounded-full animate-pulse"></div>
                                <div className="bg-white p-4 rounded-3xl relative">
                                    <img src={qr} alt="Protocol Sync QR" className="w-64 h-64 mix-blend-multiply" />
                                </div>
                            </div>
                            <div className="flex flex-col items-center gap-3">
                                <div className="flex items-center gap-2 text-indigo-400 font-black uppercase tracking-[0.2em] text-[10px]">
                                    <Loader2 size={12} className="animate-spin" />
                                    <span>Escaneo de Seguridad Pendiente</span>
                                </div>
                                <p className="text-slate-500 text-[10px] font-medium max-w-[240px]">Abre WhatsApp {'>'} Dispositivos Vinculados {'>'} Vincular dispositivo</p>
                            </div>
                        </motion.div>
                    )}

                    {status === 'connected' && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
                            <div className="w-24 h-24 bg-emerald-500/10 rounded-[2.5rem] flex items-center justify-center mx-auto border border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                                <CheckCircle2 size={56} className="text-emerald-400" />
                            </div>
                            <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter">Enlace Activo</h4>
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Canal seguro establecido con éxito</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="flex justify-between items-center pt-8 border-t border-white/5">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-slate-600 hover:text-white transition-all font-black uppercase tracking-widest text-[10px] group"
                >
                    <LayoutDashboard size={14} className="group-hover:-translate-x-1 transition-transform" /> Ir al Dashboard
                </button>
            </div>
        </div>
    );
};

export default StepWhatsApp;
