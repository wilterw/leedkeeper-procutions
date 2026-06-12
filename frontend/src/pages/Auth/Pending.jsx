import React from 'react';
import { Clock, ShieldAlert, LogOut, ArrowRight, Activity, ShieldCheck, Cpu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

const Pending = () => {
    const { logout, user } = useAuth();

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6 relative overflow-hidden bg-slate-950">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#444 1px, transparent 1px), linear-gradient(90deg, #444 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-indigo-500/5 blur-[150px] rounded-full pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card max-w-2xl w-full p-10 md:p-16 text-center relative z-10 border-indigo-500/10 shadow-3xl bg-slate-900/60 backdrop-blur-3xl"
            >
                <div className="relative inline-block mb-12">
                    <div className="w-28 h-28 rounded-[2.5rem] bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                        <Cpu size={56} className="text-indigo-400" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-slate-950 rounded-2xl border-2 border-slate-900 flex items-center justify-center shadow-2xl">
                        <Activity size={24} className="text-emerald-400 animate-pulse" />
                    </div>
                </div>

                <div className="space-y-4 mb-12">
                    <h2 className="text-4xl font-black tracking-tighter uppercase italic">Sincronización en Curso</h2>
                    <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px]">Validación de Infraestructura y Agente IA</p>
                </div>

                <div className="text-lg text-slate-400 mb-12 font-medium leading-relaxed max-w-md mx-auto">
                    Hola <span className="text-white font-black">{user?.name.toUpperCase()}</span>.
                    Tu terminal para <span className="text-indigo-400 font-bold">{user?.inmobiliaria?.companyName.toUpperCase()}</span> está siendo configurada en nuestro clúster privado.
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 text-left">
                    <InstructionItem icon={<ShieldCheck size={18} />} title="Validación KYB" desc="Verificación de identidad comercial." />
                    <InstructionItem icon={<ShieldAlert size={18} />} title="Aprovisionamiento" desc="Asignación de recursos GPT-4o." />
                </div>

                <button
                    onClick={logout}
                    className="flex items-center gap-3 text-slate-600 hover:text-white transition-all mx-auto font-black uppercase tracking-[0.2em] text-[10px] group border-t border-white/5 pt-8 w-full justify-center"
                >
                    <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" /> Desconectarse del Sistema
                </button>
            </motion.div>
        </div>
    );
};

const InstructionItem = ({ icon, title, desc }) => (
    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex gap-4 items-center">
        <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400">{icon}</div>
        <div>
            <div className="text-xs font-black text-white uppercase tracking-wider">{title}</div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{desc}</div>
        </div>
    </div>
);

export default Pending;
