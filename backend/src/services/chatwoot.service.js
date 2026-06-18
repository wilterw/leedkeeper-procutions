const axios = require('axios');
require('dotenv').config();

const CHATWOOT_URL = process.env.CHATWOOT_URL;
const CHATWOOT_TOKEN = process.env.CHATWOOT_TOKEN;
const CHATWOOT_ACCOUNT_ID = process.env.CHATWOOT_ACCOUNT_ID;

const api = axios.create({
    baseURL: CHATWOOT_URL,
    headers: {
        'Content-Type': 'application/json',
        'api_access_token': CHATWOOT_TOKEN
    }
});

const chatwootService = {
    /**
     * Crea un inbox de tipo API en la cuenta maestra
     * @param {string} name Nombre del inbox (Inmobiliaria)
     */
    async createInbox(name) {
        try {
            const response = await api.post(`/api/v1/accounts/${CHATWOOT_ACCOUNT_ID}/inboxes`, {
                name: name,
                channel: {
                    type: 'api'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error al crear inbox en Chatwoot:', error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Crea un contacto (por si se necesita registrar el lead manualmente)
     */
    async createContact(accountId, payload) {
        try {
            const response = await api.post(`/api/v1/accounts/${accountId}/contacts`, payload);
            return response.data;
        } catch (error) {
            console.error('Error al crear contacto en Chatwoot:', error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Listar inboxes
     */
    async listInboxes() {
        try {
            const response = await api.get(`/api/v1/accounts/${CHATWOOT_ACCOUNT_ID}/inboxes`);
            return response.data;
        } catch (error) {
            console.error('Error al listar inboxes en Chatwoot:', error.response?.data || error.message);
            throw error;
        }
    }
};

module.exports = chatwootService;
