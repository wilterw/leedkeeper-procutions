import React, { useState, useEffect } from 'react';
import {
    QrCode,
    RefreshCw,
    CheckCircle2,
    AlertCircle,
    Wifi,
    ShieldCheck,
    Zap,
    Smartphone,
    Check,
    ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

const StepWhatsApp = ({ onNext }) => {
    const { user } = useAuth();
    const [qr, setQr] = useState('');
    const [status, setStatus] = useState('DISCONNECTED');
    const [loading, setLoading] = useState(false);
    const [instanceName, setInstanceName] = useState('');

    useEffect(() => {
        if (user?.inmobiliariaId) {
            fetchQr();
        }
    }, [user]);

    useEffect(() => {
        let interval;
        if (instanceName && status !== 'CONNECTED') {
            interval = setInterval(checkStatus, 5000);
        }
        return () => clearInterval(interval);
    }, [instanceName, status]);

    const fetchQr = async () => {
        if (!user?.inmobiliariaId) return;
        setLoading(true);
        setStatus('CONNECTING');
        try {
            const response = await api.post('/whatsapp/connect', {
                inmobiliariaId: user.inmobiliariaId
            });
            if (response.data.status === 'CONNECTED') {
                setStatus('CONNECTED');
                setInstanceName(response.data.instanceName || '');
            } else if (response.data.qrcode) {
                setQr(response.data.qrcode);
                setInstanceName(response.data.instanceName);
                setStatus('CONNECTING');
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
            }
        } catch (error) {
            console.error('Status check error:', error);
        }
    };

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-2xl shrink-0">
                    <Smartphone className="text-emerald-400" size={32} />
                </div>
                <div>
                    <h3 className="text-2xl md:text-3xl font-black tracking-tight uppercase italic">Vinculación WhatsApp</h3>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Conexión con el Motor de Mensajería IA</p>
                </div>
            </div>

            {/* Content */}
            <div className="glass-card p-6 md:p-10 border-emerald-500/10 bg-emerald-500/[0.02]">
                {status === 'CONNECTED' ? (
                    /* Estado: Conectado */
                    <div className="text-center space-y-6 py-8">
                        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                            <Check className="w-10 h-10 text-emerald-400" />
                        </div>
                        <div>
                            <h4 className="text-xl font-black text-emerald-400 uppercase">¡Motor Listo!</h4>
                            <p className="text-slate-500 text-sm mt-2">WhatsApp conectado y sincronizado con Chatwoot.</p>
                        </div>
                    </div>
                ) : qr ? (
                    /* Estado: Mostrando QR */
                    <div className="flex flex-col items-center space-y-8">
                        <div className="p-4 bg-white rounded-3xl inline-block shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                            <img src={qr} alt="WhatsApp QR" className="w-56 h-56 md:w-64 md:h-64" />
                        </div>
                        <div className="flex flex-col items-center gap-4">
                            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold animate-pulse">
                                <Wifi className="w-4 h-4" />
                                ESPERANDO ESCANEO
                            </div>
                            <div className="text-center space-y-2">
                                {[
                                    { icon: Smartphone, text: 'Abre WhatsApp en tu móvil' },
                                    { icon: ShieldCheck, text: 'Ve a Dispositivos Vinculados' },
                                    { icon: QrCode, text: 'Escanea este código' }
                                ].map((s, i) => (
                                    <div key={i} className="flex items-center gap-3 text-sm text-slate-400">
                                        <s.icon className="w-4 h-4 text-slate-600 shrink-0" />
                                        {s.text}
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={fetchQr}
                                disabled={loading}
                                className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-xs font-black uppercase tracking-widest mt-2"
                            >
                                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                                Actualizar QR
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Estado: Cargando */
                    <div className="text-center space-y-6 py-8">
                        <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto"></div>
                        <p className="text-slate-500 font-medium">Solicitando acceso al motor Evolution...</p>
                    </div>
                )}

                {status === 'ERROR' && (
                    <div className="mt-6 flex items-center justify-center gap-2 text-red-400 text-xs font-bold bg-red-400/10 px-4 py-3 rounded-xl">
                        <AlertCircle className="w-4 h-4" />
                        Error de comunicación. Intenta de nuevo.
                    </div>
                )}
            </div>

            {/* Footer Nav */}
            <div className="flex justify-end pt-4 border-t border-white/5">
                {status === 'CONNECTED' && (
                    <button onClick={onNext} className="btn-primary px-12 py-5 font-black text-sm uppercase tracking-widest flex items-center justify-center gap-4 group">
                        Siguiente Fase <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default StepWhatsApp;
