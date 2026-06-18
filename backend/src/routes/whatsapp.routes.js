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

        // 1. Nombre único para la instancia (Apuntando a la manual creada por el usuario)
        const instanceName = inmo.evolutionInstanceName || 'lk_mh_office';
        console.log(`[Step 1] Iniciando orquestación para: ${instanceName}`);

        // 2. Verificar si YA está conectada
        try {
            const status = await evolutionService.connectionState(instanceName);
            if (status.instance?.state === 'open') {
                console.log(`[Step 1] Instancia ${instanceName} ya está conectada. Saltando QR.`);
                return res.json({
                    status: 'CONNECTED',
                    instanceName,
                    chatwootInboxId: inmo.chatwootInboxId
                });
            }
        } catch (e) {
            console.log(`[Step 1] No se pudo verificar estado previo (probablemente no existe), procediendo a crear.`);
        }

        // 3. Orquestación EvolutionAPI (Crear si no existe)
        try {
            console.log(`[Step 1] Intentando crear instancia en Evolution: ${instanceName}`);
            await evolutionService.createInstance(instanceName);
            console.log(`[Step 1] Instancia Evolution lista o ya existente`);
        } catch (e) {
            console.error(`[Step 1] Falló creación en Evolution: ${e.message}`);
        }

        // 3. Orquestación Chatwoot (Crear Inbox si no existe)
        let chatwootInboxId = inmo.chatwootInboxId;
        if (!chatwootInboxId) {
            try {
                console.log(`[Step 1] Creando Inbox en Chatwoot para: ${inmo.companyName}`);
                const inboxName = `WA - ${inmo.companyName}`;
                const inbox = await chatwootService.createInbox(inboxName);
                chatwootInboxId = inbox.id.toString();
                console.log(`[Step 1] Inbox Chatwoot creado: ${chatwootInboxId}`);

                // 4. VINCULACIÓN: Configurar Chatwoot en la instancia de Evolution
                console.log(`[Step 1] Vinculando Evolution con Chatwoot (Inbox: ${chatwootInboxId})`);
                await evolutionService.setChatwoot(
                    instanceName,
                    process.env.CHATWOOT_URL,
                    process.env.CHATWOOT_TOKEN,
                    process.env.CHATWOOT_ACCOUNT_ID,
                    chatwootInboxId
                );
                console.log(`[Step 1] Vinculación exitosa`);

                // Guardamos la configuración en la base de datos
                await prisma.inmobiliaria.update({
                    where: { id: inmobiliariaId },
                    data: {
                        chatwootAccountId: process.env.CHATWOOT_ACCOUNT_ID,
                        chatwootInboxId: chatwootInboxId,
                        evolutionInstanceName: instanceName
                    }
                });
                console.log(`[Step 1] DB actualizada con datos de Chatwoot`);
            } catch (cwError) {
                console.error('⚠️ [Step 1] Falló la orquestación con Chatwoot:', cwError.message);
                // No lanzamos error aquí para intentar al menos mostrar el QR de Evolution
            }
        }

        // 5. Obtener el QR final
        console.log(`[Step 1] Solicitando QR a Evolution para: ${instanceName}`);
        const qrResponse = await evolutionService.getQRCode(instanceName);
        console.log(`[Step 1] QR recibido con éxito`);

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
