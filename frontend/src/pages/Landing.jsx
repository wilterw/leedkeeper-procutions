import React from 'react';
import {
    ArrowRight,
    Zap,
    ShieldCheck,
    Smartphone,
    Brain,
    MessageSquare,
    Bot,
    ChevronRight,
    Globe,
    Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30 selection:text-white font-sans antialiased">

            {/* Decorative Orbs */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/20 blur-[120px] rounded-full animate-pulse-slow"></div>
                <div className="absolute top-1/2 -right-24 w-80 h-80 bg-emerald-600/10 blur-[100px] rounded-full"></div>
            </div>

            {/* Navigation */}
            <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between glass-panel px-6 py-3 border-white/5 bg-slate-900/40">
                    <div className="flex items-center gap-2">
                        <div className="bg-indigo-600 p-1.5 rounded-lg">
                            <Bot className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-display font-bold text-lg tracking-tight text-white">Lead Keeper</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
                        <a href="#features" className="hover:text-white transition-colors">Características</a>
                        <a href="#ia" className="hover:text-white transition-colors">Tecnología</a>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-sm font-bold text-slate-300 hover:text-white transition-colors">Entrar</Link>
                        <Link to="/register" className="bg-white text-slate-950 px-5 py-2 rounded-full text-sm font-bold hover:bg-indigo-50 transition-all shadow-lg shadow-white/5">
                            Registrarse
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative pt-40 pb-24 px-6">
                <div className="max-w-5xl mx-auto text-center space-y-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-400 animate-fade-in">
                        <Sparkles className="w-3 h-3" />
                        Vende más con Inteligencia Artificial
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black text-white leading-[0.95] tracking-tighter">
                        EL FUTURO <br /> ES <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">AUTÓNOMO.</span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 font-medium leading-relaxed">
                        Lead Keeper es la primera IA inmobiliaria que opera 24/7, califica prospectos y sincroniza tu inventario en tiempo real. No más leads perdidos.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link to="/register" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-indigo-600/20 group">
                            Iniciar Despliegue
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <button className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold hover:bg-white/10 transition-all">
                            Ver Demo
                        </button>
                    </div>
                </div>
            </header>

            {/* Bento Grid Features */}
            <section id="features" className="px-6 py-24 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    <div className="md:col-span-2 glass-panel p-10 bg-gradient-to-br from-indigo-600/10 to-transparent border-white/10 group overflow-hidden relative">
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500/10 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="bg-indigo-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-600/30">
                            <MessageSquare className="text-white w-6 h-6" />
                        </div>
                        <h3 className="text-3xl font-display font-bold text-white mb-4">WhatsApp Nativo</h3>
                        <p className="text-slate-400 text-lg leading-relaxed">Sus clientes no quieren descargar apps. Quieren hablar por donde ya están. Nuestra IA se integra directamente en sus chats.</p>
                    </div>

                    <div className="glass-panel p-10 border-white/10 bg-slate-900/50 hover:border-emerald-500/30 transition-all">
                        <div className="bg-emerald-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                            <Zap className="text-white w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-display font-bold text-white mb-4">Respuesta Instantánea</h3>
                        <p className="text-slate-400">Reduce el tiempo de respuesta de horas a milisegundos. La IA nunca duerme.</p>
                    </div>

                    <div className="glass-panel p-10 border-white/10 bg-slate-900/50">
                        <div className="bg-slate-700 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                            <Brain className="text-white w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-display font-bold text-white mb-4">Entrenamiento XML</h3>
                        <p className="text-slate-400">Sube tu inventario y la IA conocerá cada detalle de tus propiedades al instante.</p>
                    </div>

                    <div className="md:col-span-2 glass-panel p-10 bg-slate-900/80 border-white/10 flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-1 space-y-4">
                            <h3 className="text-3xl font-display font-bold text-white">Infraestructura Crítica</h3>
                            <p className="text-slate-400 leading-relaxed">Conectamos EvolutionAPI, Chatwoot y n8n en una sola consola de mando diseñada para el alto rendimiento inmobiliario.</p>
                            <div className="flex gap-4 pt-2">
                                <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/5 text-[10px] font-bold text-slate-500">v4.0 STABLE</div>
                                <div className="px-3 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">ONLINE</div>
                            </div>
                        </div>
                        <div className="w-full md:w-48 h-48 bg-indigo-500/10 rounded-3xl border border-indigo-500/20 flex items-center justify-center">
                            <ShieldCheck className="w-20 h-20 text-indigo-400 opacity-50" />
                        </div>
                    </div>

                </div>
            </section>

            {/* Footer */}
            <footer className="px-6 py-12 border-t border-white/5 text-center">
                <p className="text-slate-600 text-sm font-medium">© 2026 Lead Keeper. La IA definitiva para el sector inmobiliario.</p>
            </footer>

        </div>
    );
};

export default Landing;
