const axios = require('axios');
require('dotenv').config();

const EVOLUTION_URL = process.env.EVOLUTION_URL;
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY;

const api = axios.create({
    baseURL: EVOLUTION_URL,
    headers: {
        'Content-Type': 'application/json',
        'apikey': EVOLUTION_API_KEY.trim()
    }
});

const evolutionService = {
    /**
     * Crea una nueva instancia para una inmobiliaria
     * @param {string} instanceName Nombre de la instancia (ej: inmobiliaria_xyz)
     */
    async createInstance(instanceName) {
        try {
            const response = await api.post('/instance/create', {
                instanceName: instanceName,
                token: `tk_${Math.random().toString(36).substring(7)}`,
                qrcode: true
            });
            return response.data;
        } catch (error) {
            console.error('❌ Error EvolutionAPI (createInstance):',
                error.response?.status,
                JSON.stringify(error.response?.data || {})
            );
            throw error;
        }
    },

    /**
     * Vincula la instancia de Evolution con Chatwoot
     */
    async setChatwoot(instanceName, chatwootUrl, chatwootToken, accountId, inboxId) {
        try {
            const response = await api.post(`/chatwoot/set/${instanceName}`, {
                enabled: true,
                url: chatwootUrl,
                token: chatwootToken,
                accountId: accountId,
                inboxId: inboxId,
                signMsg: true,
                reopenConversation: true,
                importMessages: true
            });
            return response.data;
        } catch (error) {
            console.error('❌ Error EvolutionAPI (setChatwoot):', error.response?.status);
            throw error;
        }
    },

    /**
     * Obtiene el código QR para conectar WhatsApp
     */
    async getQRCode(instanceName) {
        try {
            const response = await api.get(`/instance/connect/${instanceName}`);
            return response.data;
        } catch (error) {
            console.error('❌ Error EvolutionAPI (getQRCode):', error.response?.status, error.config?.url);
            throw error;
        }
    },

    /**
     * Verifica el estado de la conexión
     */
    async connectionState(instanceName) {
        try {
            const response = await api.get(`/instance/connectionState/${instanceName}`);
            return response.data;
        } catch (error) {
            console.error('❌ Error EvolutionAPI (connectionState):', error.response?.status);
            throw error;
        }
    },

    /**
     * Listar todas las instancias
     */
    async listInstances() {
        try {
            const response = await api.get('/instance/fetchInstances');
            return response.data;
        } catch (error) {
            console.error('❌ Error EvolutionAPI (listInstances):', error.response?.status);
            throw error;
        }
    }
};

module.exports = evolutionService;
