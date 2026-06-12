import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, Zap, Sparkles, Smartphone, BarChart3, ArrowRight, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const Landing = () => {
    return (
        <div className="min-h-screen bg-slate-950 overflow-hidden">

            {/* Ambient Background Elements */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/10 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

                    {/* Left: Content */}
                    <div className="flex-1 text-center lg:text-left space-y-8 z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-black text-[10px] uppercase tracking-widest"
                        >
                            <Sparkles size={14} /> El Futuro es Autónomo
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-7xl lg:text-8xl font-black text-white italic tracking-tighter leading-[0.9] lg:leading-[0.85]"
                        >
                            SALUDA AL <br />
                            <span className="bg-gradient-to-r from-indigo-400 via-white to-cyan-400 bg-clip-text text-transparent">FUTURO</span> DE LAS <br />
                            VENTAS.
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed"
                        >
                            Lead Keeper es el primer agente de inteligencia artificial diseñado para inmobiliarias que opera 24/7, califica prospectos y sincroniza tu inventario en tiempo real.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4"
                        >
                            <Link to="/register" className="btn-primary w-full sm:w-auto h-16 px-10 text-sm group">
                                Iniciar Despliegue <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <button className="w-full sm:w-auto h-16 px-10 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase text-xs tracking-widest hover:bg-white/10 transition-colors">
                                Ver Simulación
                            </button>
                        </motion.div>
                    </div>

                    {/* Right: Live Demo Simulator */}
                    <div className="flex-1 relative w-full max-w-xl z-20">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
                            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                            transition={{ delay: 0.4, type: 'spring' }}
                            className="glass-card p-6 md:p-8 border-indigo-500/20 shadow-[0_50px_100px_rgba(0,0,0,0.5)]"
                        >
                            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center">
                                        <Bot size={28} className="text-white" />
                                    </div>
                                    <div>
                                        <div className="text-white font-black text-xs uppercase tracking-widest">Neural Agent v4.0</div>
                                        <div className="text-emerald-400 text-[10px] uppercase font-black tracking-widest flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Sistema Online
                                        </div>
                                    </div>
                                </div>
                                <Activity size={20} className="text-slate-600" />
                            </div>

                            <div className="space-y-6">
                                <ChatBubble role="user" text="Hola, busco un dpto en Las Condes" />
                                <ChatBubble role="bot" text="¡Hola! Por supuesto. Tengo 15 opciones en Las Condes hoy. ¿Cuál es tu presupuesto máximo?" />
                                <ChatBubble role="user" text="Hasta 6000 UF" />
                                <ChatBubble role="bot" text="Tengo 3 departamentos que calzan perfecto. ¿Te gustaría agendar una visita mañana?" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Responsive Grid */}
            <section className="relative py-24 px-6 border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20 space-y-4">
                        <h2 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase">Infraestructura Crítica</h2>
                        <p className="text-slate-500 text-sm font-bold uppercase tracking-[0.4em]">Tecnología de última generación para tu inmobiliaria</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                        <FeatureCard
                            icon={<Zap />}
                            title="Despliegue Instantáneo"
                            desc="Configura tu agente en menos de 5 minutos con nuestra interfaz intuitiva de 'Command Center'."
                        />
                        <FeatureCard
                            icon={<Smartphone />}
                            title="WhatsApp Nativo"
                            desc="Integración profunda con WhatsApp para que tus clientes hablen donde ya están cómodos."
                        />
                        <FeatureCard
                            icon={<BarChart3 />}
                            title="Captura de Data"
                            desc="Identifica prospectos reales y filtra curiosos automáticamente antes de que lleguen a tu equipo humano."
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

const ChatBubble = ({ role, text }) => (
    <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-[85%] p-4 rounded-2xl md:rounded-3xl text-sm font-medium ${role === 'user'
                ? 'bg-white/5 border border-white/10 text-slate-300 rounded-tr-none'
                : 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/10 rounded-tl-none'
            }`}>
            {text}
        </div>
    </div>
);

const FeatureCard = ({ icon, title, desc }) => (
    <motion.div
        whileHover={{ y: -8 }}
        className="glass-card p-10 border-white/5 hover:border-indigo-500/30 transition-all group"
    >
        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-indigo-500 group-hover:text-white transition-all mb-8 shadow-xl">
            {React.cloneElement(icon, { size: 32 })}
        </div>
        <h3 className="text-2xl font-black text-white italic tracking-tight uppercase mb-4">{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed font-medium">{desc}</p>
    </motion.div>
);

export default Landing;
