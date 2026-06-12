import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, MessageSquare, Globe, Activity, Database, Target, Zap, ArrowRight, Users, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const ClientDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        leads: 0,
        conversations: 0
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await api.get('/clients/profile');
                setProfile(response.data);
                setStats({
                    leads: response.data.leadsCount || 0,
                    conversations: response.data.conversationsCount || 0
                });
            } catch (error) {
                console.error("Error fetching profile", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const inmo = profile?.inmobiliaria || {};
    const companyDisplayName = inmo.companyName || user?.name || 'Mi Inmobiliaria';
    const nodeId = profile?.id ? profile.id.split('-')[0] : '...';

    if (loading) return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Activity className="text-indigo-500 animate-pulse" size={48} />
                <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px]">Iniciando Nodo...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 lg:p-12 pb-24">
            <div className="max-w-7xl mx-auto space-y-12">

                {/* Header Profile */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-cyan-400 p-1 shadow-2xl">
                            <div className="w-full h-full bg-slate-900 rounded-[1.3rem] flex items-center justify-center">
                                <span className="text-2xl md:text-3xl font-black text-white">
                                    {(user?.name || 'U')[0].toUpperCase()}
                                </span>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic text-white line-clamp-1">{companyDisplayName}</h1>
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">ID NODO: {nodeId}</span>
                                <span className={`px-2 py-0.5 rounded-full ${inmo.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'} text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-current/20`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${inmo.isActive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></div> {inmo.isActive ? 'Online' : 'Pendiente Activación'}
                                </span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* 5-Step Activation Matrix */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    <StatusCard
                        step="Paso 1"
                        label="WhatsApp"
                        icon={<MessageSquare size={20} />}
                        desc={inmo.whatsappNumber ? 'Sincronizado' : 'Vincular QR'}
                        color={inmo.whatsappNumber ? 'emerald' : 'amber'}
                        onClick={() => navigate('/onboarding')}
                    />
                    <StatusCard
                        step="Paso 2"
                        label="Inventario"
                        icon={<Database size={20} />}
                        desc={inmo.xmlUrl ? 'Enlazado' : 'Subir XML'}
                        color={inmo.xmlUrl ? 'cyan' : 'amber'}
                        onClick={() => navigate('/onboarding')}
                    />
                    <StatusCard
                        step="Paso 3"
                        label="Cerebro IA"
                        icon={<Bot size={20} />}
                        desc={inmo.llmApiKey ? 'Configurado' : 'Setear LLM'}
                        color={inmo.llmApiKey ? 'indigo' : 'amber'}
                        onClick={() => navigate('/onboarding')}
                    />
                    <StatusCard
                        step="Paso 4"
                        label="Atención"
                        icon={<Target size={20} />}
                        desc="Protocolos"
                        color={inmo.strategyConfig ? 'emerald' : 'amber'}
                        onClick={() => navigate('/onboarding')}
                    />
                    <StatusCard
                        step="Paso 5"
                        label="Equipo"
                        icon={<Users size={20} />}
                        desc="Personal"
                        color={inmo.companyName ? 'cyan' : 'amber'}
                        onClick={() => navigate('/onboarding')}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 glass-card p-8 border-white/5 space-y-8">
                        <div className="flex items-center gap-3 mb-6 font-black uppercase tracking-tighter italic text-2xl">
                            <Activity className="text-indigo-400" /> Flujo de Leads
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5">
                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Leads Calificados</div>
                                <div className="text-5xl font-black">{stats.leads}</div>
                            </div>
                            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5">
                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Conversaciones</div>
                                <div className="text-5xl font-black">{stats.conversations}</div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-8 border-white/5 space-y-6">
                        <div className="flex items-center gap-3 font-black uppercase tracking-tighter italic text-2xl">
                            <Zap className="text-amber-400" /> Comandos
                        </div>
                        <div className="space-y-3">
                            <button className="w-full flex items-center justify-between p-4 bg-white/[0.02] rounded-2xl border border-white/5 hover:bg-white/[0.05] transition-all group">
                                <div className="flex items-center gap-3 uppercase font-black text-[10px] tracking-widest"><Users size={16} /> Ver Prospectos</div>
                                <ArrowRight size={16} />
                            </button>
                            <button onClick={() => navigate('/onboarding')} className="w-full flex items-center justify-between p-4 bg-white/[0.02] rounded-2xl border border-white/5 hover:bg-white/[0.05] transition-all group">
                                <div className="flex items-center gap-3 uppercase font-black text-[10px] tracking-widest"><Database size={16} /> Configurar Nodo</div>
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatusCard = ({ step, label, icon, desc, color, onClick }) => {
    const colorStyles = {
        emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        amber: 'text-amber-400 bg-amber-500/10 border-amber-500/30 border-dashed animate-pulse',
        cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
        indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20'
    };

    return (
        <div onClick={onClick} className="glass-card p-4 border-white/5 hover:border-white/20 transition-all cursor-pointer group flex items-start gap-4">
            <div className={`p-3 rounded-2xl ${colorStyles[color] || colorStyles.amber}`}>
                {icon}
            </div>
            <div>
                <div className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">{step}</div>
                <div className="text-sm font-black text-white uppercase tracking-wider mb-0.5">{label}</div>
                <div className="text-[9px] font-bold text-slate-400 flex items-center gap-1">{desc} <ArrowRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" /></div>
            </div>
        </div>
    );
};

export default ClientDashboard;
