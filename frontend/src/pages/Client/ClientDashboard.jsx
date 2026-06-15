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
    ChevronRight
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
            color: 'text-indigo-400',
            bg: 'bg-indigo-400/10',
            active: stats?.isReady,
            link: '/onboarding?step=launch'
        }
    ];

    const completedSteps = activationSteps.filter(s => s.active).length;
    const progressPercent = (completedSteps / activationSteps.length) * 100;

    if (loading) return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                <p className="text-slate-400 animate-pulse font-medium">Sincronizando Cerebro...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-950 text-white pb-12">
            {/* Top Navbar */}
            <nav className="glass-panel mx-6 mt-6 p-4 border-none shadow-xl flex items-center justify-between rounded-2xl">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-500 p-2 rounded-xl">
                        <LayoutDashboard className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="font-bold text-lg hidden md:block">Lead Keeper</h2>
                        <p className="text-xs text-slate-400 hidden md:block">{user?.name}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-full border border-white/5">
                        <div className={`w-2 h-2 rounded-full ${stats?.isReady ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                        <span className="text-xs font-semibold">{stats?.isReady ? 'SISTEMA ACTIVO' : 'ONBOARDING PENDIENTE'}</span>
                    </div>
                    <button onClick={handleLogout} className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-white">
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Welcome Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="glass-panel p-8">
                        <h1 className="text-4xl font-extrabold mb-4 leading-tight">
                            Hola, <span className="text-indigo-400">{user?.name?.split(' ')[0]}</span>
                        </h1>
                        <p className="text-slate-400 mb-8">
                            Estás a solo <span className="text-white font-bold">{5 - completedSteps} pasos</span> de tener tu asistente inmobiliaria operando al 100%.
                        </p>

                        <div className="space-y-4">
                            <div className="flex justify-between text-sm font-bold mb-2">
                                <span>Progreso General</span>
                                <span className="text-indigo-400">{Math.round(progressPercent)}%</span>
                            </div>
                            <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-white/5 p-0.5">
                                <div
                                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-6 overflow-hidden relative group">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-amber-500/10 p-3 rounded-2xl">
                                <ShieldCheck className="w-6 h-6 text-amber-500" />
                            </div>
                            <div>
                                <h3 className="font-bold">Acceso a Leads</h3>
                                <p className="text-xs text-slate-400">Sincronización en tiempo real</p>
                            </div>
                        </div>
                        <button className="w-full py-3 bg-slate-900 hover:bg-slate-800 rounded-xl text-sm font-bold transition-all border border-white/5">
                            Ver Historial de Leads
                        </button>
                    </div>
                </div>

                {/* Action Center - 5 Steps */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <Zap className="w-5 h-5 text-indigo-400" />
                            Pasos de Configuración
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {activationSteps.map((step, idx) => (
                            <Link
                                to={step.link}
                                key={step.id}
                                className={`glass-card p-6 flex flex-col justify-between group h-full ${step.active ? 'border-emerald-500/30' : ''}`}
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`${step.bg} p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
                                        <step.icon className={`w-8 h-8 ${step.color}`} />
                                    </div>
                                    {step.active ? (
                                        <div className="bg-emerald-500/10 text-emerald-500 text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-widest border border-emerald-500/20">
                                            Activo
                                        </div>
                                    ) : (
                                        <div className="bg-slate-800 text-slate-500 text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-widest">
                                            Pendiente
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <h4 className="text-lg font-bold mb-1 group-hover:text-indigo-400 transition-colors">
                                        {idx + 1}. {step.title}
                                    </h4>
                                    <p className="text-xs text-slate-400 mb-6">{step.desc}</p>

                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 group-hover:text-white transition-colors">
                                        <span>Configurar ahora</span>
                                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="glass-panel p-6 bg-indigo-600/10 border-indigo-500/20">
                        <div className="flex items-center gap-6">
                            <div className="p-4 bg-indigo-500 rounded-2xl shadow-lg shadow-indigo-500/40 hidden sm:block">
                                <Rocket className="w-8 h-8" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold mb-2">Asistente Integrada</h3>
                                <p className="text-sm text-slate-400">
                                    Una vez completes los 5 pasos, tu inmobiliaria tendrá un asistente IA en WhatsApp capaz de responder objeciones, agendar citas y calificar leads.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ClientDashboard;
