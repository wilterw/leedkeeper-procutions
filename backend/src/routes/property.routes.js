const express = require('express');
const router = express.Router();
const xmlService = require('../services/xml.service');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Sincronizar propiedades desde XML
router.post('/sync', async (req, res) => {
    try {
        const { inmobiliariaId, xmlUrl } = req.body;

        if (!xmlUrl) return res.status(400).json({ error: 'URL de XML requerida' });

        // Actualizar URL en la base de datos
        await prisma.inmobiliaria.update({
            where: { id: inmobiliariaId },
            data: { xmlUrl }
        });

        // Ejecutar primer import
        const count = await xmlService.importProperties(inmobiliariaId, xmlUrl);

        res.json({ message: 'Sincronización completada', propertiesCount: count });
    } catch (error) {
        console.error('Sync Error:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/:inmobiliariaId', async (req, res) => {
    try {
        const properties = await prisma.property.findMany({
            where: { inmobiliariaId: req.params.inmobiliariaId },
            take: 50
        });
        res.json(properties);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
