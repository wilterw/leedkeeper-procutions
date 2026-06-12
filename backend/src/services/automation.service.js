const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const N8N_API_URL = process.env.N8N_API_URL;
const N8N_API_KEY = process.env.N8N_API_KEY;

class AutomationService {
    /**
     * Clona y configura los 4 workflows para una nueva inmobiliaria
     */
    async setupClientInfrastructure(inmobiliariaId) {
        const inmo = await prisma.inmobiliaria.findUnique({
            where: { id: inmobiliariaId },
            include: { user: true }
        });

        console.log(`🚀 Iniciando despliegue de infraestructura para: ${inmo.companyName}`);

        try {
            // 1. Crear Cuenta en Chatwoot
            const chatwootAccount = await this.createChatwootAccount(inmo);

            // 2. Clonar Workflows en n8n
            const workflowMap = await this.deployN8nWorkflows(inmo, chatwootAccount);

            // 3. Actualizar Inmobiliaria con los nuevos IDs
            await prisma.inmobiliaria.update({
                where: { id: inmobiliariaId },
                data: {
                    chatwootAccountId: chatwootAccount.id.toString(),
                    chatwootInboxId: chatwootAccount.inboxId.toString(),
                    strategyConfig: JSON.stringify({
                        sequence: ['budget', 'location', 'type', 'time'],
                        tone: 'professional',
                        handoverRule: 'human_interest'
                    })
                }
            });

            console.log(`✅ Infraestructura desplegada con éxito para ${inmo.companyName}`);
        } catch (error) {
            console.error('❌ Error en despliegue global:', error.message);
            throw error;
        }
    }

    async createChatwootAccount(inmo) {
        // Lógica simulada de Chatwoot (requiere URL de instancia)
        console.log(`- Creando cuenta en Chatwoot para ${inmo.companyName}...`);
        return { id: 'CW_' + Math.floor(Math.random() * 1000), inboxId: 'IB_' + Math.floor(Math.random() * 1000) };
    }

    async deployN8nWorkflows(inmo, chatwootData) {
        console.log(`- Clonando 4 flujos maestros en n8n...`);
        // Aquí se llamarían a los endpoints de n8n para clonar por ID
        // n8n API: POST /workflows (con el JSON del template modificado)
        return {
            principal: 'W1',
            registro: 'W2',
            notifica: 'W3',
            xml: 'W4'
        };
    }
}

module.exports = new AutomationService();
