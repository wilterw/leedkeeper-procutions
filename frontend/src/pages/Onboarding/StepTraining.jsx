import React, { useState } from 'react';
import { Bot, Plus, Trash2, ChevronLeft, CheckCircle, Lightbulb, Target, Settings2, Command } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import toast from 'react-hot-toast';

const StepTraining = ({ onPrev, onComplete }) => {
    const [steps, setSteps] = useState([
        'Saludar cordialmente y preguntar qué tipo de propiedad busca.',
        'Preguntar por el presupuesto máximo y zona de interés.',
        'Ofrecer opciones basadas en el catálogo XML sincronizado.'
    ]);
    const [newStep, setNewStep] = useState('');
    const [loading, setLoading] = useState(false);

    const addStep = () => {
        if (!newStep) return;
        setSteps([...steps, newStep]);
        setNewStep('');
    };

    const removeStep = (index) => {
        setSteps(steps.filter((_, i) => i !== index));
    };

    const handleFinish = async () => {
        setLoading(true);
        try {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            await api.post('/onboarding/training', {
                inmobiliariaId: storedUser.inmobiliariaId,
                trainingSteps: steps
            });
            toast.success('Protocolos Desplegados al 100%');
            onComplete();
        } catch (e) {
            toast.error('Fallo en la secuencia de finalización');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-2xl shrink-0">
                    <Settings2 className="text-indigo-400" size={32} />
                </div>
                <div>
                    <h3 className="text-3xl font-black tracking-tight uppercase italic">Motor de Lógica</h3>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Configuración de Reglas de Comportamiento</p>
                </div>
            </div>

            <div className="space-y-4">
                <AnimatePresence>
                    {steps.map((s, i) => (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            key={i}
                            className="flex items-center gap-5 p-5 bg-slate-950/50 border border-white/5 rounded-2xl group hover:border-indigo-500/20 transition-all shadow-inner"
                        >
                            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-[10px] font-black border border-indigo-500/20">
                                L-{i + 1}
                            </div>
                            <span className="flex-1 text-sm font-medium text-slate-300">{s}</span>
                            <button onClick={() => removeStep(i)} className="p-3 text-slate-600 hover:text-red-400 transition-colors" title="Eliminar regla">
                                <Trash2 size={18} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div className="flex gap-4">
                <div className="relative flex-1 group">
                    <Command className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={20} />
                    <input
                        type="text"
                        className="input-field pl-14 h-16 bg-slate-950 border-white/5 focus:border-indigo-500/30 text-sm"
                        placeholder="Nueva instrucción lógica para el Agente..."
                        value={newStep}
                        onChange={(e) => setNewStep(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addStep()}
                    />
                </div>
                <button onClick={addStep} className="w-16 h-16 bg-indigo-600 hover:bg-indigo-500 rounded-2xl transition-all shadow-xl shadow-indigo-500/20 text-white flex items-center justify-center active:scale-95 shrink-0">
                    <Plus size={28} />
                </button>
            </div>

            <div className="bg-gradient-to-r from-indigo-500/10 via-indigo-500/5 to-transparent border-l-4 border-indigo-500 p-8 rounded-r-2xl">
                <div className="flex gap-5">
                    <Lightbulb className="text-indigo-400 shrink-0 mt-1" size={24} />
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Optimización de Agente</p>
                        <p className="text-sm text-slate-500 leading-relaxed font-medium">
                            Estas reglas definen la jerarquía de decisiones del <span className="text-indigo-400 font-bold uppercase tracking-widest text-[11px]">Neural Engine</span>.
                            Prioriza la captura de datos antes de enviar el catálogo completo.
                        </p>
                    </div>
                </div>
            </div>

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
                            Inicializar Despliegue <CheckCircle size={22} className="opacity-60" />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default StepTraining;
