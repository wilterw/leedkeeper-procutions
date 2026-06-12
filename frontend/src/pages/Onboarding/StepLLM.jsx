import React, { useState } from 'react';
import { Key, Sparkles, ChevronRight, Loader2, Cpu, BrainCircuit } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../services/api';

const StepLLM = ({ onNext }) => {
    const [provider, setProvider] = useState('openai');
    const [apiKey, setApiKey] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!apiKey) return toast.error('Se requiere API KEY para continuar');
        setLoading(true);
        try {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            await api.post('/onboarding/llm', {
                inmobiliariaId: storedUser.inmobiliariaId,
                provider,
                apiKey
            });
            toast.success('Núcleo Neural Configurado');
            onNext();
        } catch (e) {
            toast.error('Fallo en la sincronización de la clave');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-2xl shrink-0">
                    <BrainCircuit className="text-indigo-400" size={32} />
                </div>
                <div>
                    <h3 className="text-3xl font-black tracking-tight uppercase italic">Núcleo Neural</h3>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Selección del Motor de Inteligencia Artificial</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <ProviderCard
                    active={provider === 'openai'}
                    onClick={() => setProvider('openai')}
                    name="OpenAI"
                    desc="GPT-4o Excellence"
                    icon={<div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-black">GP</div>}
                />
                <ProviderCard
                    active={provider === 'google'}
                    onClick={() => setProvider('google')}
                    name="Google"
                    desc="Gemini Pro 1.5"
                    icon={<div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 font-black">GE</div>}
                />
                <ProviderCard
                    active={provider === 'openrouter'}
                    onClick={() => setProvider('openrouter')}
                    name="OpenRouter"
                    desc="Claude & Llama"
                    icon={<div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 font-black">OR</div>}
                />
            </div>

            <div className="space-y-4">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Clave de Acceso (API KEY)</label>
                <div className="relative group">
                    <Key className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={20} />
                    <input
                        type="password"
                        aria-label="API Key input"
                        className="input-field pl-14 h-16 bg-slate-950/50 border-white/5 focus:border-indigo-500/40 text-sm font-mono tracking-widest"
                        placeholder="sk-••••••••••••••••••••••••"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                    />
                </div>
                <div className="flex items-start gap-2 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="text-[10px] text-slate-500 font-medium leading-relaxed italic">
                        * Tu clave será cifrada localmente y enviada vía túnel SSL. Nosotros no almacenamos las claves en texto plano.
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-8 border-t border-white/5">
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="btn-primary px-12 py-5 font-black text-sm uppercase tracking-widest flex items-center gap-4 active:scale-95 transition-all shadow-2xl shadow-indigo-500/20"
                >
                    {loading ? <Loader2 className="animate-spin text-white" size={20} /> : (
                        <>
                            Siguiente Fase <ChevronRight size={20} className="opacity-50" />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

const ProviderCard = ({ active, onClick, name, desc, icon }) => (
    <button
        onClick={onClick}
        aria-pressed={active}
        className={`p-6 rounded-2xl border transition-all text-left group relative overflow-hidden h-40 flex flex-col justify-between ${active ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_30px_rgba(99,102,241,0.1)]' : 'border-white/5 bg-white/5 hover:border-white/10'
            }`}
    >
        {active && (
            <div className="absolute top-0 right-0 p-3">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_10px_#6366f1]"></div>
            </div>
        )}
        {icon}
        <div>
            <div className={`font-black text-lg uppercase tracking-tighter transition-colors ${active ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>{name}</div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{desc}</div>
        </div>
    </button>
);

export default StepLLM;
