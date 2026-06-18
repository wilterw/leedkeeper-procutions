import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Users, CheckCircle, XCircle, Clock, Search, ShieldCheck, Activity, ArrowUpRight, Filter, Mail, Building2, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [expandedClient, setExpandedClient] = useState(null);
    const [newUser, setNewUser] = useState({
        name: '', email: '', password: '', companyName: '', planType: 'PRO', days: 30
    });

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const response = await api.get('/admin/inmobiliarias');
            setClients(response.data);
        } catch (error) {
            toast.error('Error al cargar datos del sistema');
        } finally {
            setLoading(false);
        }
    };

    const handleActivate = async (id, days = 7) => {
        try {
            await api.post('/admin/activate', { inmobiliariaId: id, days });
            toast.success('Licencia activada con éxito');
            fetchClients();
        } catch (error) {
            toast.error('Fallo en la activación');
        }
    };

    const handleSuspend = async (id) => {
        try {
            await api.post('/admin/suspend', { inmobiliariaId: id });
            toast.success('Sistemas suspendidos para el cliente');
            fetchClients();
        } catch (error) {
            toast.error('Fallo en la suspensión');
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/users', newUser);
            toast.success('Usuario e Inmobiliaria creados');
            setShowCreateModal(false);
            setNewUser({ name: '', email: '', password: '', companyName: '', planType: 'PRO', days: 30 });
            fetchClients();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Error al crear usuario');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('¿Eliminar permanentemente este usuario e infraestructura?')) return;
        try {
            await api.delete(`/admin/users/${userId}`);
            toast.success('Usuario eliminado');
            fetchClients();
        } catch (error) {
            toast.error('Fallo al eliminar');
        }
    };

    const filteredClients = clients.filter(c =>
        c.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.user?.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 lg:p-12 pb-24">
            <div className="max-w-7xl mx-auto space-y-12">

                {/* Header Section */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-indigo-500 rounded-2xl shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                                <ShieldCheck className="text-white" size={28} />
                            </div>
                            <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic">Control Panel</h1>
                        </div>
                        <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] pl-16">Infrastructure Management v1.0</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="h-14 px-8 bg-brand-600 rounded-2xl text-white font-black text-xs uppercase tracking-widest hover:bg-brand-500 transition-all shadow-xl shadow-brand-600/20 w-full sm:w-auto flex items-center justify-center gap-2"
                        >
                            <Building2 size={16} />
                            Crear Nodo
                        </button>

                        <button
                            onClick={() => {
                                localStorage.removeItem('token');
                                window.location.href = '/login';
                            }}
                            className="h-14 px-8 bg-white/5 border border-white/10 rounded-2xl text-red-500 font-black text-xs uppercase tracking-widest hover:bg-red-500/10 transition-all w-full sm:w-auto flex items-center justify-center gap-2"
                        >
                            <LogOut size={16} />
                            Cerrar Sesión
                        </button>

                        <div className="relative w-full sm:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input
                                type="text"
                                className="input-field pl-12 h-14 bg-slate-900/40 border-white/5 focus:border-indigo-500/40"
                                placeholder="Buscar..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    <StatBox icon={<Users />} label="Nodos Totales" value={clients.length} color="indigo" />
                    <StatBox icon={<CheckCircle />} label="Activos" value={clients.filter(c => c.isActive).length} color="emerald" />
                    <StatBox icon={<Clock />} label="Pendientes" value={clients.filter(c => !c.isActive).length} color="amber" />
                    <StatBox icon={<Activity />} label="Uptime" value="99.9%" color="cyan" />
                </div>

                {/* Clients List */}
                <div className="glass-card overflow-hidden border-white/10 bg-slate-900/40 backdrop-blur-xl">

                    {/* Desktop Table View */}
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/[0.02] border-b border-white/5">
                                    <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 text-center w-16">Status</th>
                                    <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Inmobiliaria Entity</th>
                                    <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Primary Contact</th>
                                    <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Exp. Date</th>
                                    <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 text-right">Control</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.03]">
                                <AnimatePresence>
                                    {loading ? (
                                        <tr><td colSpan="5" className="px-8 py-20 text-center text-slate-500 font-bold uppercase tracking-widest text-xs">Scanning systems...</td></tr>
                                    ) : filteredClients.map(client => (
                                        <React.Fragment key={client.id}>
                                            <motion.tr
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className={`hover:bg-white/[0.01] transition-all group cursor-pointer ${expandedClient === client.id ? 'bg-indigo-500/5' : ''}`}
                                                onClick={() => setExpandedClient(expandedClient === client.id ? null : client.id)}
                                            >
                                                <td className="px-8 py-6 text-center">
                                                    <div className={`w-3 h-3 rounded-full mx-auto ${client.isActive ? 'bg-emerald-400 shadow-[0_0_10px_#10b981]' : 'bg-amber-400 shadow-[0_0_10px_#f59e0b] animate-pulse'}`}></div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="font-bold text-lg text-white group-hover:text-indigo-400 transition-colors uppercase italic truncate max-w-[200px]">{client.companyName}</div>
                                                    <div className="text-[10px] font-mono text-slate-600 mt-1 uppercase tracking-tighter">ID: {client.id.split('-')[0]}</div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-500 text-[10px] uppercase">
                                                            {client.user?.name.charAt(0)}
                                                        </div>
                                                        <div className="max-w-[150px]">
                                                            <div className="font-bold text-slate-300 text-sm truncate">{client.user?.name}</div>
                                                            <div className="text-[10px] text-slate-600 truncate">{client.user?.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="text-sm font-black text-slate-300">
                                                        {client.expiresAt ? new Date(client.expiresAt).toLocaleDateString() : 'NULL'}
                                                    </div>
                                                    <div className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mt-1 tracking-tighter italic">{client.planType} SYSTEM</div>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <ActionButtons
                                                        active={client.isActive}
                                                        onActivate={(e) => { e.stopPropagation(); handleActivate(client.id); }}
                                                        onSuspend={(e) => { e.stopPropagation(); handleSuspend(client.id); }}
                                                        onDelete={(e) => { e.stopPropagation(); handleDeleteUser(client.user.id); }}
                                                    />
                                                </td>
                                            </motion.tr>
                                            {expandedClient === client.id && (
                                                <tr className="bg-slate-900/60">
                                                    <td colSpan="5" className="px-8 py-10">
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                                            <CredentialBox label="WhatsApp Integration" value={client.whatsappNumber || 'Not Configured'} icon={<Mail size={14} />} />
                                                            <CredentialBox label="LLM API Key" value={client.llmApiKey ? '••••••••' + client.llmApiKey.slice(-4) : 'Empty'} icon={<ShieldCheck size={14} />} secret />
                                                            <CredentialBox label="XML Inventory URL" value={client.xmlUrl || 'Pending'} icon={<Building2 size={14} />} />
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>

            {/* Create Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
                            onClick={() => setShowCreateModal(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-2xl glass-card p-8 md:p-12 border-indigo-500/20"
                        >
                            <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-8">Registrar Nuevo Nodo</h2>
                            <form onSubmit={handleCreateUser} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Nombre Completo</label>
                                        <input required className="input-field h-14" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Email Corporativo</label>
                                        <input required type="email" className="input-field h-14" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Password</label>
                                        <input required type="password" className="input-field h-14" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Inmobiliaria / Empresa</label>
                                        <input required className="input-field h-14" value={newUser.companyName} onChange={e => setNewUser({ ...newUser, companyName: e.target.value })} />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-4 pt-4">
                                    <button type="button" onClick={() => setShowCreateModal(false)} className="px-8 h-14 rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:bg-white/5">Cancelar</button>
                                    <button type="submit" className="btn-primary px-12 h-14">Desplegar Infraestructura</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const CredentialBox = ({ label, value, icon, secret }) => (
    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-400">
            {icon} {label}
        </div>
        <div className={`font-mono text-xs ${secret ? 'text-amber-400' : 'text-slate-300 underline'}`}>
            {value}
        </div>
    </div>
);

const StatBox = ({ icon, label, value, color }) => {
    const colors = {
        indigo: 'text-indigo-400 border-indigo-500/20 bg-indigo-500/5 shadow-indigo-500/5',
        emerald: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5 shadow-emerald-500/5',
        amber: 'text-amber-400 border-amber-500/20 bg-amber-500/5 shadow-amber-500/5',
        cyan: 'text-cyan-400 border-cyan-500/20 bg-cyan-400/5 shadow-cyan-500/5',
    };

    return (
        <div className={`p-6 rounded-[2.5rem] border transition-all hover:scale-[1.02] shadow-2xl ${colors[color]}`}>
            <div className="flex items-center justify-between mb-4">
                <span className="opacity-60">{React.cloneElement(icon, { size: 24 })}</span>
                <span className="text-2xl md:text-3xl font-black tracking-tighter">{value}</span>
            </div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">{label}</div>
        </div>
    );
};

const ActionButtons = ({ active, onActivate, onSuspend, onDelete, mobile }) => (
    <div className={`flex gap-3 ${mobile ? 'w-full flex-wrap' : ''}`}>
        {!active ? (
            <button
                onClick={onActivate}
                className={`btn-primary flex-1 ${!mobile ? 'h-11 px-6 text-[10px]' : 'h-14 text-xs'}`}
            >
                Autorizar <ArrowUpRight size={14} />
            </button>
        ) : (
            <button
                onClick={onSuspend}
                className={`flex-1 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 hover:border-amber-500/50 hover:text-amber-400 font-black text-[10px] md:text-xs uppercase tracking-widest transition-all ${!mobile ? 'h-11 px-6' : 'h-14'}`}
            >
                Suspender
            </button>
        )}
        <button
            onClick={onDelete}
            className={`rounded-xl md:rounded-2xl bg-white/5 border border-white/10 hover:border-red-500/50 hover:text-red-400 flex items-center justify-center transition-all ${!mobile ? 'h-11 w-11' : 'h-14 w-14'}`}
        >
            <XCircle size={16} />
        </button>
    </div>
);

export default AdminDashboard;
