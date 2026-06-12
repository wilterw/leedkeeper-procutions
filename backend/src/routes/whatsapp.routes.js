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
        const instanceName = `lk_${inmobiliariaId.split('-')[0]}_${inmo.companyName.toLowerCase().replace(/\s+/g, '_')}`;

        // 2. Orquestación EvolutionAPI
        let instance;
        try {
            instance = await evolutionService.createInstance(instanceName);
        } catch (e) {
            // Si ya existe, simplemente obtenemos el nombre
            instance = { instanceName };
        }

        // 3. Orquestación Chatwoot (Si no tiene cuenta asignada)
        let chatwootAccount = inmo.chatwootAccountId;
        if (!chatwootAccount) {
            // Aquí iría la lógica de crear cuenta en Chatwoot si se usa una instancia multi-account
            // Por ahora usamos la del .env pero preparamos el guardado
            chatwootAccount = process.env.CHATWOOT_ACCOUNT_ID;
        }

        let chatwootInboxId = inmo.chatwootInboxId;
        if (!chatwootInboxId) {
            try {
                const inboxName = `LK - ${inmo.companyName}`;
                const inbox = await chatwootService.createInbox(inboxName);
                chatwootInboxId = inbox.id.toString();

                // Guardamos la configuración en la base de datos
                await prisma.inmobiliaria.update({
                    where: { id: inmobiliariaId },
                    data: {
                        chatwootAccountId: chatwootAccount,
                        chatwootInboxId: chatwootInboxId,
                        evolutionInstanceName: instanceName
                    }
                });
            } catch (cwError) {
                console.error('⚠️ Advertencia: Falló la creación del Inbox en Chatwoot, continuando con QR de WhatsApp...', cwError.message);
                // No lanzamos el error para permitir que se vea el QR
            }
        }

        // 4. Obtener el QR final de la instancia vinculada
        const qrResponse = await evolutionService.getQRCode(instanceName);

        res.json({
            qrcode: qrResponse.base64 || qrResponse.code || qrResponse.qrcode,
            instanceName,
            chatwootAccountId: chatwootAccount,
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
