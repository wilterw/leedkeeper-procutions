import React, { useState } from 'react';
import { Globe, Database, ChevronRight, ChevronLeft, Loader2, Check, RefreshCcw, Link2, Server } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import toast from 'react-hot-toast';

const StepXML = ({ onNext, onPrev }) => {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [verified, setVerified] = useState(false);

    const handleVerify = async () => {
        if (!url) return toast.error('Se requiere la URL del origen de datos');
        setLoading(true);
        try {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            await api.post('/properties/sync', {
                inmobiliariaId: storedUser.inmobiliariaId,
                xmlUrl: url
            });
            setVerified(true);
            toast.success('Puente de Datos Establecido');
        } catch (e) {
            toast.error('Fallo en la validación del protocolo XML');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-2xl shrink-0">
                    <Server className="text-indigo-400" size={32} />
                </div>
                <div>
                    <h3 className="text-3xl font-black tracking-tight uppercase italic">Puente de Datos</h3>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Sincronización de Inventario vía XML API</p>
                </div>
            </div>

            <div className="glass-card p-6 md:p-10 border-indigo-500/10 bg-indigo-500/[0.02] space-y-10">
                <div className="flex flex-col gap-6">
                    <div className="space-y-3">
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Dirección del Feed XML (Source)</label>
                        <div className="relative group">
                            <Link2 className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={20} />
                            <input
                                type="url"
                                required
                                className="input-field pl-14 h-16 bg-slate-950 border-white/5 focus:border-indigo-500/40 text-sm font-medium transition-all"
                                placeholder="https://api.tuinmobiliaria.com/v1/feed.xml"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                            />
                        </div>
                    </div>
                    <button
                        onClick={handleVerify}
                        disabled={loading || verified}
                        className={`w-full h-16 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4 active:scale-95 ${verified ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-500/20'
                            }`}
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : verified ? <Check size={20} /> : 'Establecer Enlace Digital'}
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-white/5 pt-8">
                    <SyncSpec label="Protocolo" value="XML/APINMO" />
                    <SyncSpec label="Frecuencia" value="Cron 24h" />
                    <SyncSpec label="Cifrado" value="TLS 1.3" />
                    <SyncSpec label="Validación" value="Estructural" />
                </div>
            </div>

            <div className="flex justify-between items-center pt-8 border-t border-white/5">
                <button onClick={onPrev} className="flex items-center gap-2 text-slate-600 hover:text-white transition-all font-black uppercase tracking-widest text-[10px] group">
                    <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Volver
                </button>
                {verified && (
                    <button onClick={onNext} className="btn-primary px-12 py-5 font-black text-sm uppercase tracking-widest flex items-center justify-center gap-4 group">
                        Siguiente Fase <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                )}
            </div>
        </div>
    );
};

const SyncSpec = ({ label, value }) => (
    <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.01] border border-white/[0.03]">
        <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{label}</span>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider italic">{value}</span>
    </div>
);

export default StepXML;
