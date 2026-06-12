const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Obtener perfil completo con datos de inmobiliaria
router.get('/profile', async (req, res) => {
    try {
        const fullUser = await prisma.user.findUnique({
            where: { id: req.user.id },
            include: { inmobiliaria: true }
        });
        res.json(fullUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Actualizar configuración técnica del cliente
router.put('/config', async (req, res) => {
    try {
        const { whatsappNumber, xmlUrl, llmApiKey, llmProvider } = req.body;

        const updated = await prisma.inmobiliaria.update({
            where: { userId: req.user.id },
            data: {
                whatsappNumber,
                xmlUrl,
                llmApiKey,
                llmProvider: llmProvider || 'openai'
            }
        });

        res.json({ message: 'Configuración actualizada con éxito', updated });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
