const axios = require('axios');
require('dotenv').config();

const N8N_URL = process.env.N8N_URL;
const N8N_API_KEY = process.env.N8N_API_KEY;

const api = axios.create({
    baseURL: `${N8N_URL}/api/v1`,
    headers: {
        'Content-Type': 'application/json',
        'X-N8N-API-KEY': N8N_API_KEY
    }
});

// IDs de los Workflows Maestros
const MASTER_WORKFLOWS = {
    PRINCIPAL: 'aOhLC5IYRNj4ybnr',
    REGISTRO: 'SwCHQ6Qe9CcD643I',
    NOTIFICAR: 'Y2GGO5kKNAWe3CPM',
    CLASIFICAR: 'j1Nz82mFrSs5y7te',
    MCP: 'qGTFP5G4TXmj2bXk'
};

const n8nService = {
    /**
     * Obtiene un workflow por ID
     */
    async getWorkflow(id) {
        try {
            const response = await api.get(`/workflows/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error al obtener workflow ${id} de n8n:`, error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Crea un nuevo workflow
     */
    async createWorkflow(data) {
        try {
            const response = await api.post('/workflows', data);
            return response.data;
        } catch (error) {
            console.error('Error al crear workflow en n8n:', error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Activa un workflow
     */
    async activateWorkflow(id) {
        try {
            const response = await api.post(`/workflows/${id}/activate`);
            return response.data;
        } catch (error) {
            console.error(`Error al activar workflow ${id} en n8n:`, error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Clona y personaliza los workflows para un nuevo cliente
     * @param {Object} inmo Objeto de la base de datos Inmobiliaria con sus relaciones
     */
    async deployClientWorkflows(inmo) {
        const deployedWorkflows = [];

        for (const [type, masterId] of Object.entries(MASTER_WORKFLOWS)) {
            try {
                const masterWf = await this.getWorkflow(masterId);

                const newWfData = {
                    name: `[LK] ${inmo.name} - ${type}`,
                    nodes: this.personalizeNodes(masterWf.nodes, inmo),
                    connections: masterWf.connections,
                    settings: masterWf.settings,
                    meta: masterWf.meta
                };

                const createdWf = await this.createWorkflow(newWfData);

                // Intentar activar el workflow
                try {
                    await this.activateWorkflow(createdWf.id);
                } catch (e) {
                    console.warn(`No se pudo activar el workflow ${createdWf.id} automáticamente.`);
                }

                deployedWorkflows.push({
                    type: type.toLowerCase(),
                    id: createdWf.id
                });

            } catch (error) {
                console.error(`Fallo al desplegar workflow ${type} para ${inmo.name}:`, error.message);
            }
        }

        return deployedWorkflows;
    },

    /**
     * Lógica para buscar y reemplazar tokens, URLs y credenciales en los nodos del workflow
     */
    personalizeNodes(nodes, inmo) {
        return nodes.map(node => {
            let nodeStr = JSON.stringify(node);

            // 1. Reemplazar Chatwoot
            const masterToken = "PpmriHuUhF51nU7fXtpf1gEK";
            const masterAccount = "2";

            // Si el cliente tiene sus propios datos, los inyectamos
            // Nota: Aquí se asume que usamos el token maestro por ahora si no hay uno por cliente
            if (inmo.chatwootAccountId) {
                nodeStr = nodeStr.replace(new RegExp(`accounts/${masterAccount}`, 'g'), `accounts/${inmo.chatwootAccountId}`);
            }

            // 2. Inyectar Prompt de Entrenamiento
            if (inmo.agentTrainingPrompt) {
                // Buscamos un placeholder o el texto del agente anterior en el nodo de OpenAI/Langchain
                // En este flujo, el prompt maestro suele estar en un nodo tipo "Agent" o "OpenAI"
                nodeStr = nodeStr.replace(/{{AGENT_PROMPT}}/g, inmo.agentTrainingPrompt);
                // También intentamos reemplazo por palabras clave si no hay placeholder
                nodeStr = nodeStr.replace(/Tu eres un agente inmobiliario.../g, inmo.agentTrainingPrompt);
            }

            // 3. Inyectar API Key de la IA del cliente
            if (inmo.llmApiKey) {
                // Reemplazamos cualquier API Key hardcodeada o placeholder
                nodeStr = nodeStr.replace(/{{LLM_API_KEY}}/g, inmo.llmApiKey);
                // Si el nodo de n8n usa credenciales guardadas, esto es más complejo, 
                // pero si el usuario selecciona "API Key" directa en el nodo, esto funciona.
            }

            // 4. Inyectar Instance Name de Evolution
            if (inmo.evolutionInstanceName) {
                nodeStr = nodeStr.replace(/{{EVOLUTION_INSTANCE}}/g, inmo.evolutionInstanceName);
            }

            return JSON.parse(nodeStr);
        });
    },

    /**
     * Desactiva todos los workflows de una inmobiliaria
     * @param {String} inmobiliariaId 
     */
    async deactivateClientWorkflows(inmobiliariaId) {
        try {
            const { PrismaClient } = require('@prisma/client');
            const prisma = new PrismaClient();

            const configs = await prisma.workflowConfig.findMany({
                where: { inmobiliariaId }
            });

            for (const config of configs) {
                if (config.n8nWorkflowId) {
                    try {
                        await api.post(`/workflows/${config.n8nWorkflowId}/deactivate`);
                    } catch (e) {
                        console.error(`Error desactivando wf ${config.n8nWorkflowId}:`, e.message);
                    }
                }
            }
            await prisma.$disconnect();
        } catch (error) {
            console.error('Error en deactivateClientWorkflows:', error.message);
        }
    }
};

module.exports = n8nService;
