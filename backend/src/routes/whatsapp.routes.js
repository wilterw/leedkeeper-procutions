const express = require('express');
const router = express.Router();
const evolutionService = require('../services/evolution.service');
const chatwootService = require('../services/chatwoot.service');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Paso 1: Crear instancia, cuenta Chatwoot e Inbox unificado
router.post('/connect', async (req, res) => {
    try {
        const { inmobiliariaId } = req.body;
        const inmo = await prisma.inmobiliaria.findUnique({ where: { id: inmobiliariaId } });

        if (!inmo) return res.status(404).json({ error: 'Inmobiliaria no encontrada' });

        // 1. Nombre único para la instancia
        const instanceName = inmo.evolutionInstanceName || `lk_${inmo.id.slice(0, 8)}_${inmo.companyName.toLowerCase().replace(/\s+/g, '_')}`;

        // 2. Orquestación EvolutionAPI (Crear si no existe)
        try {
            await evolutionService.createInstance(instanceName);
        } catch (e) {
            console.log('Instance already exists or creation failed, continuing...');
        }

        // 3. Orquestación Chatwoot (Crear Inbox si no existe)
        let chatwootInboxId = inmo.chatwootInboxId;
        if (!chatwootInboxId) {
            try {
                const inboxName = `WA - ${inmo.companyName}`;
                const inbox = await chatwootService.createInbox(inboxName);
                chatwootInboxId = inbox.id.toString();

                // 4. VINCULACIÓN: Configurar Chatwoot en la instancia de Evolution
                await evolutionService.setChatwoot(
                    instanceName,
                    process.env.CHATWOOT_URL,
                    process.env.CHATWOOT_TOKEN,
                    process.env.CHATWOOT_ACCOUNT_ID,
                    chatwootInboxId
                );

                // Guardamos la configuración en la base de datos
                await prisma.inmobiliaria.update({
                    where: { id: inmobiliariaId },
                    data: {
                        chatwootAccountId: process.env.CHATWOOT_ACCOUNT_ID,
                        chatwootInboxId: chatwootInboxId,
                        evolutionInstanceName: instanceName
                    }
                });
            } catch (cwError) {
                console.error('⚠️ Falló la orquestación con Chatwoot:', cwError.message);
            }
        }

        // 5. Obtener el QR final de la instancia vinculada
        const qrResponse = await evolutionService.getQRCode(instanceName);

        res.json({
            qrcode: qrResponse.base64 || qrResponse.code || qrResponse.qrcode,
            instanceName,
            chatwootInboxId: chatwootInboxId
        });

    } catch (error) {
        console.error('Error en orquestación Step 1:', error);
        res.status(500).json({ error: error.message });
    }
});

// Verificar estado
router.get('/status/:instanceName', async (req, res) => {
    try {
        const status = await evolutionService.connectionState(req.params.instanceName);
        res.json(status);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
