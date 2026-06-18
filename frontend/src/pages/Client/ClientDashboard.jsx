import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
    CheckCircle2,
    Circle,
    ArrowRight,
    MessageSquare,
    Brain,
    Users,
    FileText,
    Rocket,
    ShieldCheck,
    Zap,
    LayoutDashboard,
    LogOut,
    ChevronRight,
    Sparkles
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const ClientDashboard = () => {
    const { user, logout } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/clients/me`);
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const activationSteps = [
        {
            id: 'whatsapp',
            title: 'WhatsApp Business',
            desc: 'Conexión con EvolutionAPI',
            icon: MessageSquare,
            color: 'text-emerald-400',
            bg: 'bg-emerald-400/10',
            active: stats?.whatsappConnected,
            link: '/onboarding?step=whatsapp'
        },
        {
            id: 'ia',
            title: 'Cerebro IA',
            desc: 'Conocimiento experto (XML)',
            icon: Brain,
            color: 'text-purple-400',
            bg: 'bg-purple-400/10',
            active: stats?.iaTrained,
            link: '/onboarding?step=xml'
        },
        {
            id: 'equipo',
            title: 'Gestión de Equipo',
            desc: 'Asesores comerciales',
            icon: Users,
            color: 'text-blue-400',
            bg: 'bg-blue-400/10',
            active: stats?.teamConfigured,
            link: '/onboarding?step=team'
        },
        {
            id: 'propiedades',
            title: 'Portafolio',
            desc: 'Inventario inmobiliario',
            icon: FileText,
            color: 'text-amber-400',
            bg: 'bg-amber-400/10',
            active: stats?.propertiesImported,
            link: '/onboarding?step=properties'
        },
        {
            id: 'go',
            title: 'Lanzamiento',
            desc: 'Sincronizar con Chatwoot',
            icon: Rocket,
            color: 'text-brand-400',
            bg: 'bg-brand-400/10',
            active: stats?.isReady,
            link: '/onboarding?step=launch'
        }
    ];

    const completedSteps = activationSteps.filter(s => s.active).length;
    const progressPercent = (completedSteps / activationSteps.length) * 100;

    if (loading) return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin"></div>
                <p className="text-slate-400 animate-pulse font-medium">Sincronizando Cerebro...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-950 text-white pb-12">
            {/* Background Decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-brand-500/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-accent-500/5 blur-[120px] rounded-full" />
            </div>

            {/* Top Navbar */}
            <nav className="glass mx-6 mt-6 p-4 border shadow-xl flex items-center justify-between rounded-2xl relative z-10">
                <div className="flex items-center gap-3">
                    <div className="bg-brand-500 p-2 rounded-xl">
                        <LayoutDashboard className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="font-display font-black text-lg hidden md:block">Lead Keeper</h2>
                        <p className="text-xs text-slate-400 hidden md:block font-bold uppercase tracking-wider">{user?.name}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                        <div className={`w-2 h-2 rounded-full ${stats?.isReady ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                        <span className="text-[10px] font-black tracking-widest">{stats?.isReady ? 'SISTEMA ACTIVO' : 'ONBOARDING PENDIENTE'}</span>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 mt-12 relative z-10">
                {/* Horizontal Activation Steps */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-black flex items-center gap-2 uppercase tracking-widest text-slate-500">
                            <Zap className="w-4 h-4 text-brand-400" />
                            Progreso de Configuración
                        </h3>
                        <div className="text-xs font-bold text-slate-400">
                            {completedSteps} de {activationSteps.length} completados
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        {activationSteps.map((step, idx) => (
                            <Link
                                to={step.link}
                                key={step.id}
                                className={`glass-card p-5 flex flex-col justify-between group transition-all hover:scale-[1.02] ${step.active ? 'border-emerald-500/30 bg-emerald-500/5' : 'hover:border-brand-500/30'}`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`${step.bg} p-2.5 rounded-xl`}>
                                        <step.icon className={`w-5 h-5 ${step.color}`} />
                                    </div>
                                    {step.active && (
                                        <CheckCircle2 size={16} className="text-emerald-500" />
                                    )}
                                </div>
                                <div>
                                    <h4 className="text-xs font-black mb-1 group-hover:text-brand-400 transition-colors uppercase tracking-tight">
                                        {idx + 1}. {step.title}
                                    </h4>
                                    <div className="flex items-center gap-1 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                                        <span>{step.active ? 'Completado' : 'Configurar'}</span>
                                        {!step.active && <ChevronRight size={10} />}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Welcome Sidebar */}
                    <div className="lg:col-span-12 xl:col-span-4 space-y-6">
                        <div className="glass-card p-10 rounded-[40px]">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 mb-6">
                                <Sparkles size={12} className="text-brand-400" />
                                <span className="text-[10px] font-black tracking-widest uppercase text-brand-300 italic">Panel de Control</span>
                            </div>
                            <h1 className="text-4xl font-black mb-4 leading-tight">
                                Hola, <span className="text-brand-400">{user?.name?.split(' ')[0]}</span>
                            </h1>
                            <p className="text-slate-400 mb-8 font-medium">
                                Estás a solo <span className="text-white font-black">{5 - completedSteps} pasos</span> de tener tu asistente inmobiliaria operando al 100%.
                            </p>

                            <div className="space-y-4">
                                <div className="flex justify-between text-xs font-black uppercase tracking-widest mb-2">
                                    <span>Progreso</span>
                                    <span className="text-brand-400">{Math.round(progressPercent)}%</span>
                                </div>
                                <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                                    <div
                                        className="h-full bg-gradient-to-r from-brand-500 to-accent-500 rounded-full transition-all duration-1000 ease-out"
                                        style={{ width: `${progressPercent}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        <Link to="/settings" className="glass-card p-6 rounded-3xl flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                                <div className="bg-white/5 p-3 rounded-2xl group-hover:bg-brand-500/10 transition-colors">
                                    <Users className="w-5 h-5 text-slate-400 group-hover:text-brand-400" />
                                </div>
                                <span className="font-bold text-sm">Configuración de Cuenta</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-600 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="lg:col-span-12 xl:col-span-8 flex flex-col justify-center">
                        <div className="glass-card p-10 rounded-[40px] bg-brand-500/5 border-brand-500/20 relative overflow-hidden h-full flex items-center">
                            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                                <Rocket size={120} className="text-brand-500" />
                            </div>
                            <div className="flex items-center gap-8 relative z-10 w-full">
                                <div className="p-8 bg-brand-500 rounded-3xl shadow-2xl shadow-brand-500/40 hidden sm:block">
                                    <Rocket className="w-12 h-12 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-3xl font-black mb-4 italic">IA de Ventas Autónoma</h3>
                                    <p className="text-base text-slate-400 leading-relaxed font-medium">
                                        Una vez completes los 5 pasos de arriba, tu inmobiliaria tendrá un agente IA en WhatsApp capaz de responder objeciones, agendar citas y calificar leads de forma 100% autónoma.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ClientDashboard;
