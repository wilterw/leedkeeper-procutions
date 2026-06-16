import React from 'react';
import {
    ArrowRight,
    Zap,
    ShieldCheck,
    Brain,
    MessageSquare,
    Bot,
    Sparkles,
    CheckCircle2,
    BarChart3,
    Clock,
    MousePointer2
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-brand-500/30">
            {/* Background Decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-500/10 blur-[120px] rounded-full animate-glow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-500/5 blur-[120px] rounded-full animate-glow" style={{ animationDelay: '2s' }} />
                <div className="absolute inset-0 bg-grid opacity-[0.03]" />
            </div>

            {/* Navigation */}
            <nav className="fixed top-6 left-0 w-full z-50 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="glass px-6 py-4 rounded-3xl flex justify-between items-center shadow-2xl shadow-black/50">
                        <div className="flex items-center gap-3 group cursor-pointer">
                            <div className="bg-gradient-to-br from-brand-400 to-brand-600 p-2 rounded-xl group-hover:scale-110 transition-transform duration-500">
                                <Bot size={22} className="text-white" />
                            </div>
                            <span className="font-display font-black text-xl tracking-tight">LEAD KEEPER</span>
                        </div>

                        <div className="hidden md:flex items-center gap-10">
                            <a href="#features" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">Funciones</a>
                            <a href="#ia" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">Cerebro IA</a>
                            <a href="#results" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">Resultados</a>
                        </div>

                        <div className="flex items-center gap-6">
                            <Link to="/login" className="text-sm font-bold text-slate-300 hover:text-white transition-colors">Entrar</Link>
                            <Link to="/register" className="bg-white text-slate-950 px-6 py-2.5 rounded-full text-sm font-black hover:scale-105 transition-transform active:scale-95 shadow-lg shadow-white/10">
                                Empezar Gratis
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative pt-44 pb-32 px-6 overflow-hidden">
                <div className="max-w-5xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 mb-10 animate-reveal" style={{ animationDelay: '0.1s' }}>
                        <Sparkles size={14} className="text-brand-400" />
                        <span className="text-[10px] font-black tracking-[0.2em] uppercase text-brand-300">Inteligencia Autónoma Inmobiliaria</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tight mb-8 animate-reveal" style={{ animationDelay: '0.2s' }}>
                        <span className="text-gradient">VENDE MÁS</span> <br />
                        <span className="text-brand-gradient italic">SIN ESFUERZO.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed animate-reveal font-medium" style={{ animationDelay: '0.3s' }}>
                        Transforma tu stock XML en un agente de ventas 24/7.
                        Lead Keeper automatiza WhatsApp, califica leads y agenda citas mientras tú duermes.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-5 animate-reveal" style={{ animationDelay: '0.4s' }}>
                        <Link to="/register" className="btn-premium group w-full sm:w-auto">
                            Activar mi Agente IA
                            <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <button className="btn-secondary w-full sm:w-auto group">
                            <MousePointer2 size={18} className="mr-2 group-hover:rotate-12 transition-transform" />
                            Ver Demo en Vivo
                        </button>
                    </div>

                    {/* Social Proof */}
                    <div className="mt-20 pt-10 border-t border-white/5 animate-reveal" style={{ animationDelay: '0.5s' }}>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">Integración Nativa con</p>
                        <div className="flex flex-wrap justify-center items-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
                            <span className="text-xl font-black">CHATWOOT</span>
                            <span className="text-xl font-black">N8N</span>
                            <span className="text-xl font-black">EVOLUTION API</span>
                            <span className="text-xl font-black">WHATSAPP</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Features - Bento Grid */}
            <section id="features" className="py-32 px-6 relative">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-black mb-4">Potencia Cognitiva</h2>
                        <p className="text-slate-400">Todo lo que necesitas para escalar tu inmobiliaria al siguiente nivel.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Main Feature - Large */}
                        <div className="md:col-span-2 glass-card p-10 rounded-[40px] flex flex-col justify-between overflow-hidden relative group">
                            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                                <MessageSquare size={200} className="text-brand-500" />
                            </div>
                            <div className="relative z-10">
                                <div className="bg-brand-500/10 p-4 rounded-2xl w-fit mb-8">
                                    <MessageSquare size={32} className="text-brand-400" />
                                </div>
                                <h3 className="text-3xl font-black mb-4">WhatsApp Nativo 24/7</h3>
                                <p className="text-slate-400 text-lg max-w-md">
                                    No es un simple bot. Es un agente que entiende emociones, maneja objeciones complejas y utiliza el tono de voz de tu marca inmobiliaria.
                                </p>
                            </div>
                            <div className="mt-12 flex items-center gap-4 relative z-10">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-950 bg-slate-800" />
                                    ))}
                                </div>
                                <span className="text-xs font-bold text-slate-500">+500 conversaciones hoy</span>
                            </div>
                        </div>

                        {/* Secondary Feature 1 */}
                        <div className="glass-card p-10 rounded-[40px] border-b-4 border-accent-500/30">
                            <div className="bg-accent-500/10 p-4 rounded-2xl w-fit mb-8">
                                <Brain size={32} className="text-accent-400" />
                            </div>
                            <h3 className="text-2xl font-black mb-4">Cerebro XML</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Sincroniza tus portales. La IA conoce cada metro cuadrado de tu inventario y lo recomienda de forma inteligente.
                            </p>
                        </div>

                        {/* Secondary Feature 2 */}
                        <div className="glass-card p-10 rounded-[40px] border-b-4 border-brand-400/30">
                            <div className="bg-brand-400/10 p-4 rounded-2xl w-fit mb-8">
                                <Zap size={32} className="text-brand-400" />
                            </div>
                            <h3 className="text-2xl font-black mb-4">Calificación Real</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Filtra curiosos de compradores reales. Entrega a tus asesores solo leads listos para visitar la propiedad.
                            </p>
                        </div>

                        {/* Secondary Feature 3 - Wide */}
                        <div className="md:col-span-2 glass-card p-10 rounded-[40px] flex items-center gap-10">
                            <div className="hidden sm:block bg-brand-500/5 p-10 rounded-[32px]">
                                <ShieldCheck size={64} className="text-brand-500" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black mb-4">Blindaje Tecnológico</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Infraestructura basada en n8n + Chatwoot. Estabilidad garantizada del 99.9% para que nunca pierdas una oportunidad de venta.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Dashboard Preview / CTA */}
            <section className="py-20 px-6">
                <div className="max-w-5xl mx-auto glass rounded-[48px] p-12 text-center relative overflow-hidden border-brand-500/20">
                    <div className="absolute inset-0 bg-brand-500/5 pointer-events-none" />
                    <h2 className="text-4xl md:text-5xl font-black mb-8 relative z-10">
                        ¿Listo para dominar <br /> el mercado?
                    </h2>
                    <p className="text-slate-400 mb-12 max-w-xl mx-auto relative z-10 font-medium">
                        Únete a las inmobiliarias que ya están escalando sus ventas con Inteligencia Artificial Autónoma.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
                        <Link to="/register" className="btn-premium px-12 group">
                            Empezar Demo Gratis
                            <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                            <CheckCircle2 size={16} className="text-accent-500" />
                            Configuración en 15 minutos
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 px-6 border-t border-white/5 relative bg-black/20">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="flex items-center gap-3">
                        <div className="bg-slate-800 p-2 rounded-xl">
                            <Bot size={20} className="text-white" />
                        </div>
                        <span className="font-display font-black text-lg tracking-tight uppercase">LEAD KEEPER</span>
                    </div>

                    <div className="flex gap-10">
                        <a href="#" className="text-xs font-bold text-slate-500 hover:text-white transition-colors">POLÍTICA</a>
                        <a href="#" className="text-xs font-bold text-slate-500 hover:text-white transition-colors">TÉRMINOS</a>
                        <a href="#" className="text-xs font-bold text-slate-500 hover:text-white transition-colors">SOPORTE</a>
                    </div>

                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                        © 2026 LEAD KEEPER. INGENIERÍA PARA INMOBILIARIAS.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
