import React, { useState, useEffect } from 'react';
import { Bot, MessageSquare, Database, Shield, Save, ArrowLeft, Smartphone, Globe, Key } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ClientSettings = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [config, setConfig] = useState({
        whatsappNumber: '',
        xmlUrl: '',
        llmApiKey: '',
        llmProvider: 'openai'
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/client/profile');
            if (response.data.inmobiliaria) {
                const inmo = response.data.inmobiliaria;
                setConfig({
                    whatsappNumber: inmo.whatsappNumber || '',
                    xmlUrl: inmo.xmlUrl || '',
                    llmApiKey: inmo.llmApiKey || '',
                    llmProvider: inmo.llmProvider || 'openai'
                });
            }
        } catch (error) {
            toast.error('Error al cargar perfil');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.put('/client/config', config);
            toast.success('Configuración actualizada correctamente');
        } catch (error) {
            toast.error('Error al guardar cambios');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                <Shield className="text-indigo-500" size={40} />
            </motion.div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 lg:p-12 pb-24">
            <div className="max-w-4xl mx-auto space-y-12">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-xs font-black uppercase tracking-widest"
                    >
                        <ArrowLeft size={16} /> Volver al Hub
                    </button>
                    <div className="space-y-1">
                        <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic">Configuración Terminal</h1>
                        <p className="text-indigo-400 font-bold uppercase tracking-[0.3em] text-[10px]">Data & API Management</p>
                    </div>
                </div>

                {/* Settings Form */}
                <form onSubmit={handleSave} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        {/* Section: Connectivity */}
                        <div className="glass-card p-8 border-white/5 space-y-6">
                            <div className="flex items-center gap-3">
                                <Smartphone className="text-indigo-400" size={20} />
                                <h2 className="text-sm font-black uppercase tracking-widest italic">Conectividad</h2>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">WhatsApp Business</label>
                                    <div className="relative">
                                        <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                                        <input
                                            className="input-field pl-12 h-14"
                                            placeholder="+569..."
                                            value={config.whatsappNumber}
                                            onChange={e => setConfig({ ...config, whatsappNumber: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">XML Inventory Feed</label>
                                    <div className="relative">
                                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                                        <input
                                            className="input-field pl-12 h-14"
                                            placeholder="https://..."
                                            value={config.xmlUrl}
                                            onChange={e => setConfig({ ...config, xmlUrl: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section: Brain (LLM) */}
                        <div className="glass-card p-8 border-white/5 space-y-6">
                            <div className="flex items-center gap-3">
                                <Bot className="text-cyan-400" size={20} />
                                <h2 className="text-sm font-black uppercase tracking-widest italic">Cerebro AI</h2>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Proveedor</label>
                                    <select
                                        className="input-field h-14"
                                        value={config.llmProvider}
                                        onChange={e => setConfig({ ...config, llmProvider: e.target.value })}
                                    >
                                        <option value="openai">OpenAI (Recomendado)</option>
                                        <option value="openrouter">OpenRouter</option>
                                        <option value="gemini">Google Gemini</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">API Key</label>
                                    <div className="relative">
                                        <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                                        <input
                                            type="password"
                                            className="input-field pl-12 h-14"
                                            placeholder="sk-..."
                                            value={config.llmApiKey}
                                            onChange={e => setConfig({ ...config, llmApiKey: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Submit Bar */}
                    <div className="fixed bottom-0 left-0 right-0 p-6 bg-slate-950/80 backdrop-blur-xl border-t border-white/5 z-40">
                        <div className="max-w-4xl mx-auto flex justify-end">
                            <button
                                type="submit"
                                disabled={saving}
                                className="btn-primary h-14 px-12 text-xs group disabled:opacity-50"
                            >
                                {saving ? 'Sincronizando...' : (
                                    <>Actualizar Nodo <Save className="ml-2 group-hover:scale-110 transition-transform" size={16} /></>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ClientSettings;
