import React, { useState } from 'react';
import { Building2, Users, Clock, MapPin, Plus, Trash2, ChevronLeft, Loader2, CheckCircle, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import toast from 'react-hot-toast';

const StepTeam = ({ onPrev, onComplete }) => {
    const [companyInfo, setCompanyInfo] = useState({
        name: '',
        address: '',
        hours: 'Lun-Vie: 9am - 6pm'
    });
    const [agents, setAgents] = useState([
        { name: '', phone: '' }
    ]);
    const [loading, setLoading] = useState(false);

    const addAgent = () => setAgents([...agents, { name: '', phone: '' }]);
    const removeAgent = (index) => setAgents(agents.filter((_, i) => i !== index));
    const updateAgent = (index, field, value) => {
        const newAgents = [...agents];
        newAgents[index][field] = value;
        setAgents(newAgents);
    };

    const handleFinish = async () => {
        if (!companyInfo.name) return toast.error('Se requiere el nombre de la inmobiliaria');
        setLoading(true);
        try {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            await api.post('/onboarding/team-finalize', {
                inmobiliariaId: storedUser.inmobiliariaId,
                companyInfo,
                agents
            });
            toast.success('Configuración de Inmobiliaria Completada');
            onComplete();
        } catch (e) {
            toast.error('Fallo al guardar datos del equipo');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-2xl shrink-0">
                    <Building2 className="text-indigo-400" size={32} />
                </div>
                <div>
                    <h3 className="text-3xl font-black tracking-tight uppercase italic">Perfil de Empresa</h3>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Identidad Corporativa y Equipo de Ventas</p>
                </div>
            </div>

            {/* Inmobiliaria Data */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 bg-slate-950/50 rounded-3xl border border-white/5 shadow-inner">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <Building2 size={12} /> Nombre Inmobiliaria
                    </label>
                    <input
                        type="text"
                        value={companyInfo.name}
                        onChange={(e) => setCompanyInfo({ ...companyInfo, name: e.target.value })}
                        className="input-field bg-slate-900 border-white/5 focus:border-indigo-500/40"
                        placeholder="Ej: Econos Real Estate"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <Clock size={12} /> Horario de Atención
                    </label>
                    <input
                        type="text"
                        value={companyInfo.hours}
                        onChange={(e) => setCompanyInfo({ ...companyInfo, hours: e.target.value })}
                        className="input-field bg-slate-900 border-white/5 focus:border-indigo-500/40"
                        placeholder="Ej: Lun-Vie: 9am - 7pm"
                    />
                </div>
                <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <MapPin size={12} /> Dirección Física
                    </label>
                    <input
                        type="text"
                        value={companyInfo.address}
                        onChange={(e) => setCompanyInfo({ ...companyInfo, address: e.target.value })}
                        className="input-field bg-slate-900 border-white/5 focus:border-indigo-500/40"
                        placeholder="Av. Principal, Edificio Lead Keeper, Piso 5"
                    />
                </div>
            </div>

            {/* Team List */}
            <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-3">
                        <Users className="text-indigo-400" size={20} />
                        <h4 className="text-sm font-black uppercase tracking-widest text-white">Ejecutivos de Venta</h4>
                    </div>
                    <button
                        onClick={addAgent}
                        className="p-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl hover:bg-indigo-500 hover:text-white transition-all shadow-lg"
                    >
                        <Plus size={18} />
                    </button>
                </div>

                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    <AnimatePresence initial={false}>
                        {agents.map((agent, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="flex gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl group transition-all hover:bg-white/[0.04]"
                            >
                                <div className="flex-1 grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Nombre del Agente"
                                        value={agent.name}
                                        onChange={(e) => updateAgent(index, 'name', e.target.value)}
                                        className="bg-transparent border-none focus:ring-0 text-sm font-bold text-white placeholder:text-slate-700"
                                    />
                                    <input
                                        type="text"
                                        placeholder="WhatsApp (ej: +52...)"
                                        value={agent.phone}
                                        onChange={(e) => updateAgent(index, 'phone', e.target.value)}
                                        className="bg-transparent border-none focus:ring-0 text-sm font-medium text-slate-400 placeholder:text-slate-700 font-mono"
                                    />
                                </div>
                                <button
                                    onClick={() => removeAgent(index)}
                                    className="p-2 text-slate-700 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-between items-center pt-8 border-t border-white/5">
                <button onClick={onPrev} className="flex items-center gap-2 text-slate-600 hover:text-white transition-all font-black uppercase tracking-widest text-[10px] group">
                    <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Volver
                </button>
                <button
                    onClick={handleFinish}
                    disabled={loading}
                    className="btn-primary px-14 h-16 font-black text-sm uppercase tracking-[0.3em] flex items-center justify-center gap-4 active:scale-95 shadow-3xl shadow-indigo-500/40"
                >
                    {loading ? <Loader2 className="animate-spin text-white" size={24} /> : (
                        <>
                            Finalizar Onboarding <CheckCircle size={22} className="opacity-60" />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default StepTeam;
