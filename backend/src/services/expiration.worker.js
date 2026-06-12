const cron = require('node-cron');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const n8nService = require('./n8n.service');

/**
 * Worker para manejar la expiración de planes
 * Se ejecuta todos los días a la medianoche
 */
const expirationWorker = () => {
    cron.schedule('0 0 * * *', async () => {
        console.log('--- Corriendo verificación de expiración de planes ---');

        try {
            const now = new Date();

            // Buscar inmobiliarias que tengan fecha de expiración pasada y sigan activas
            const expiredInmos = await prisma.inmobiliaria.findMany({
                where: {
                    isActive: true,
                    expiresAt: {
                        lt: now
                    }
                }
            });

            for (const inmo of expiredInmos) {
                console.log(`Plan expirado para: ${inmo.name} (UUID: ${inmo.id})`);

                // Desactivar en base de datos
                await prisma.inmobiliaria.update({
                    where: { id: inmo.id },
                    data: { isActive: false }
                });

                // Apagar físicamente los bots en n8n
                await n8nService.deactivateClientWorkflows(inmo.id);
            }

            console.log(`Verificación completada. ${expiredInmos.length} cuentas suspendidas.`);
        } catch (error) {
            console.error('Error en expirationWorker:', error);
        }
    });
};

module.exports = expirationWorker;
