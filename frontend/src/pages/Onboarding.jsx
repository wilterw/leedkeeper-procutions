import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bot, MessageSquare, Globe, Key, CheckCircle2, ChevronRight, ChevronLeft, Target, ShieldCheck, Users, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import StepLLM from './Onboarding/StepLLM';
import StepWhatsApp from './Onboarding/StepWhatsApp';
import StepXML from './Onboarding/StepXML';
import StepTraining from './Onboarding/StepTraining';
import StepTeam from './Onboarding/StepTeam';

const Onboarding = () => {
    const [step, setStep] = useState(() => {
        const saved = localStorage.getItem('onboarding_step');
        return saved ? parseInt(saved) : 1;
    });
    const { user } = useAuth();

    const nextStep = () => {
        const next = step + 1;
        setStep(next);
        localStorage.setItem('onboarding_step', next);
    };

    const prevStep = () => {
        const prev = step - 1;
        setStep(prev);
        localStorage.setItem('onboarding_step', prev);
    };

    const goToStep = (s) => {
        setStep(s);
        localStorage.setItem('onboarding_step', s);
    };

    const steps = [
        { title: 'WhatsApp', icon: <MessageSquare size={18} /> },
        { title: 'Inventario', icon: <Globe size={18} /> },
        { title: 'Cerebro IA', icon: <Bot size={18} /> },
        { title: 'Protocolos', icon: <Target size={18} /> },
        { title: 'Personal', icon: <Building2 size={18} /> },
    ];

    return (
        <div className="min-h-screen bg-slate-950 py-12 px-6 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="max-w-4xl mx-auto relative z-10">
                <header className="flex flex-col items-center text-center mb-16 space-y-4">
                    <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-indigo-400">
                        <ShieldCheck size={32} />
                    </div>
                    <div>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic text-white">Activación de Nodo</h2>
                        <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] mt-2 text-center">Configura el ecosistema de tu inmobiliaria en 5 fases</p>
                    </div>
                </header>

                {/* Progressive Tracker */}
                <div className="flex items-center justify-between mb-16 relative">
                    <div className="absolute top-6 left-6 right-6 h-[2px] bg-white/5 z-0"></div>
                    <motion.div
                        className="absolute top-6 left-6 h-[2px] bg-gradient-to-r from-indigo-500 to-cyan-400 z-0 shadow-[0_0_15px_#6366f1]"
                        animate={{ width: `${((step - 1) / (steps.length - 1)) * 90}%` }}
                        transition={{ duration: 0.8, ease: "circOut" }}
                    ></motion.div>

                    {steps.map((s, i) => (
                        <div
                            key={i}
                            onClick={() => goToStep(i + 1)}
                            className="relative z-10 flex flex-col items-center group cursor-pointer"
                        >
                            <motion.div
                                animate={{
                                    scale: step === i + 1 ? 1.1 : 1,
                                    backgroundColor: step > i + 1 ? '#6366f1' : (step === i + 1 ? '#0f172a' : '#1e293b'),
                                    borderColor: step >= i + 1 ? '#6366f1' : 'rgba(255,255,255,0.05)'
                                }}
                                className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 shadow-2xl overflow-hidden`}
                            >
                                {step > i + 1 ? <CheckCircle2 size={24} className="text-white" /> :
                                    <span className={step === i + 1 ? 'text-indigo-400' : 'text-slate-600'}>{s.icon}</span>}
                            </motion.div>
                            <span className={`hidden sm:block text-[9px] mt-4 font-black tracking-[0.2em] uppercase ${step === i + 1 ? 'text-indigo-400' : 'text-slate-600'
                                }`}>{s.title}</span>
                        </div>
                    ))}
                </div>

                <motion.div
                    layout
                    className="glass-card p-4 md:p-14 border-white/5 bg-slate-900/60 backdrop-blur-3xl shadow-3xl overflow-hidden min-h-[550px] flex flex-col justify-center rounded-[2.5rem]"
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.4 }}
                        >
                            {step === 1 && <StepWhatsApp onNext={nextStep} />}
                            {step === 2 && <StepXML onNext={nextStep} onPrev={prevStep} />}
                            {step === 3 && <StepLLM onNext={nextStep} onPrev={prevStep} />}
                            {step === 4 && <StepTraining onNext={nextStep} onPrev={prevStep} />}
                            {step === 5 && <StepTeam onPrev={prevStep} onComplete={() => window.location.href = '/dashboard'} />}
                        </motion.div>
                    </AnimatePresence>
                </motion.div>

                <footer className="mt-16 flex flex-col items-center gap-4">
                    <p className="text-slate-600 font-bold uppercase tracking-[0.4em] text-[10px]">Lead Keeper Neural Framework v1.0 • Multi-Tenant Engine</p>
                </footer>
            </div>
        </div>
    );
};

export default Onboarding;
