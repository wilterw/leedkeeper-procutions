const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const automationService = require('../services/automation.service');

const prisma = new PrismaClient();

// Step 3: Configurar IA (LLM)
router.post('/llm', async (req, res) => {
    try {
        const { inmobiliariaId, provider, apiKey } = req.body;
        await prisma.inmobiliaria.update({
            where: { id: inmobiliariaId },
            data: {
                llmProvider: provider,
                llmApiKey: apiKey
            }
        });
        res.json({ message: 'Claves de IA guardadas correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Step 4: Lógica de Atención (Training/Sequence)
router.post('/training', async (req, res) => {
    try {
        const { inmobiliariaId, trainingSteps } = req.body;
        await prisma.inmobiliaria.update({
            where: { id: inmobiliariaId },
            data: {
                strategyConfig: JSON.stringify({ sequence: trainingSteps })
            }
        });
        res.json({ message: 'Protocolos de atención actualizados' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Step 5: Finalizar con datos de Equipo e Inmobiliaria (Dispara automatización)
router.post('/team-finalize', async (req, res) => {
    try {
        const { inmobiliariaId, companyInfo, agents } = req.body;

        // 1. Actualizar datos de la inmobiliaria
        await prisma.inmobiliaria.update({
            where: { id: inmobiliariaId },
            data: {
                companyName: companyInfo.name,
                address: companyInfo.address,
                // Guardamos los agentes en un campo JSON o tabla relacionada
                // Por simplicidad ahora usamos strategyConfig extendido
                strategyConfig: JSON.stringify({
                    ...JSON.parse((await prisma.inmobiliaria.findUnique({ where: { id: inmobiliariaId } })).strategyConfig || '{}'),
                    agents,
                    hours: companyInfo.hours
                })
            }
        });

        // 2. 🚀 DISPARAR INFRAESTRUCTURA (n8n, Google Sheets, etc)
        // Solo si la inmobiliaria ya está activa (pago verificado)
        const inmo = await prisma.inmobiliaria.findUnique({ where: { id: inmobiliariaId } });
        if (inmo.isActive) {
            automationService.setupClientInfrastructure(inmobiliariaId).catch(err => {
                console.error('Fallo en automatización final:', err);
            });
        }

        res.json({ message: 'Onboarding completado. Iniciando aprovisionamiento de recursos.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
