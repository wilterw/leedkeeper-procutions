import React, { useState, useEffect } from 'react';
import {
    QrCode,
    RefreshCw,
    CheckCircle2,
    AlertCircle,
    ArrowLeft,
    Wifi,
    ShieldCheck,
    Zap,
    Smartphone,
    Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

const StepWhatsApp = () => {
    const { user } = useAuth();
    const [qr, setQr] = useState('');
    const [status, setStatus] = useState('DISCONNECTED'); // DISCONNECTED, CONNECTING, CONNECTED, ERROR
    const [loading, setLoading] = useState(false);
    const [instanceName, setInstanceName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.inmobiliariaId) {
            fetchQr();
        }
    }, [user]);

    useEffect(() => {
        let interval;
        if (instanceName) {
            interval = setInterval(checkStatus, 5000);
        }
        return () => clearInterval(interval);
    }, [instanceName]);

    const fetchQr = async () => {
        if (!user?.inmobiliariaId) return;
        setLoading(true);
        setStatus('CONNECTING');
        try {
            const response = await api.post('/whatsapp/connect', {
                inmobiliariaId: user.inmobiliariaId
            });
            if (response.data.qrcode) {
                setQr(response.data.qrcode);
                setInstanceName(response.data.instanceName);
            }
        } catch (error) {
            console.error('Error fetching QR:', error);
            setStatus('ERROR');
            toast.error('No se pudo generar el QR. Reintenta en unos segundos.');
        } finally {
            setLoading(false);
        }
    };

    const checkStatus = async () => {
        if (!instanceName) return;
        try {
            const response = await api.get(`/whatsapp/status/${instanceName}`);
            if (response.data.instance?.state === 'open' || response.data.status === 'CONNECTED') {
                setStatus('CONNECTED');
                toast.success('¡WhatsApp Conectado!', {
                    icon: '✅',
                    style: { borderRadius: '1rem', background: '#1e293b', color: '#fff' }
                });
                setTimeout(() => navigate('/dashboard'), 2000);
            }
        } catch (error) {
            console.error('Status check error:', error);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 p-6 md:p-12 flex items-center justify-center relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/5 blur-[150px] rounded-full" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-emerald-600/5 blur-[150px] rounded-full" />

            <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative">

                {/* Left Side: Info */}
                <div className="space-y-8">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors group mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-bold uppercase tracking-wider">Volver al Panel</span>
                    </button>

                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">
                            <Zap className="w-3 h-3" />
                            Paso 1: Conexión Vital
                        </div>
                        <h1 className="text-5xl font-black leading-tight bg-gradient-to-br from-white via-white to-slate-500 bg-clip-text text-transparent">
                            Conecta tu <br />
                            <span className="text-emerald-400">WhatsApp AI</span>
                        </h1>
                        <p className="text-slate-400 text-lg leading-relaxed max-w-md">
                            Escanea el código QR para autorizar a tu asistente virtual. Esto permitirá responder mensajes de forma autónoma.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {[
                            { icon: Smartphone, text: 'Abre tu WhatsApp en el móvil' },
                            { icon: ShieldCheck, text: 'Ve a Dispositivos Vinculados' },
                            { icon: QrCode, text: 'Escanea el código de la derecha' }
                        ].map((step, i) => (
                            <div key={i} className="flex items-center gap-4 group">
                                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center group-hover:border-indigo-500/50 transition-colors">
                                    <step.icon className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                                </div>
                                <span className="text-slate-300 font-medium">{step.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side: QR Card */}
                <div className="flex justify-center lg:justify-end">
                    <div className="glass-panel p-2 shadow-3xl shadow-indigo-500/10 relative">
                        {/* Animated border pulse */}
                        <div className="absolute inset-0 rounded-[1.5rem] border-2 border-indigo-500/20 animate-pulse pointer-events-none" />

                        <div className="bg-slate-900 rounded-[1.2rem] p-8 md:p-12 flex flex-col items-center justify-center min-h-[400px] min-w-[320px] md:min-w-[400px]">
                            {status === 'CONNECTED' ? (
                                <div className="text-center space-y-6 py-12">
                                    <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto scale-110">
                                        <Check className="w-12 h-12 text-emerald-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold">¡Motor Listo!</h3>
                                    <p className="text-slate-400 text-sm">Redirigiendo a tu centro de control...</p>
                                </div>
                            ) : qr ? (
                                <div className="space-y-8 text-center">
                                    <div className="p-4 bg-white rounded-3xl inline-block shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                                        <img src={qr} alt="WhatsApp QR" className="w-64 h-64 md:w-72 md:h-72" />
                                    </div>
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold animate-pulse">
                                            <Wifi className="w-4 h-4" />
                                            ESPERANDO ESCANEO
                                        </div>
                                        <button
                                            onClick={fetchQr}
                                            disabled={loading}
                                            className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-xs font-black uppercase tracking-widest"
                                        >
                                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                                            Actualizar QR
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center space-y-6">
                                    <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto"></div>
                                    <p className="text-slate-500 font-medium tracking-tight">Solicitando acceso al motor Evolution...</p>
                                </div>
                            )}

                            {status === 'ERROR' && (
                                <div className="mt-6 flex items-center gap-2 text-red-400 text-xs font-bold bg-red-400/10 px-4 py-2 rounded-lg">
                                    <AlertCircle className="w-4 h-4" />
                                    ERROR DE COMUNICACIÓN
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default StepWhatsApp;
