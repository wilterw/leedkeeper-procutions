const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

// Middleware para verificar si es ADMIN
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'ADMIN') {
        next();
    } else {
        res.status(403).json({ error: 'Acceso denegado. Se requiere rol de administrador.' });
    }
};

// Aplicar seguridad a todas las rutas de este router
router.use(isAdmin);

// Listar todas las inmobiliarias y sus usuarios
router.get('/inmobiliarias', async (req, res) => {
    try {
        const inmos = await prisma.inmobiliaria.findMany({
            include: {
                user: {
                    select: { id: true, email: true, name: true, createdAt: true }
                },
                workflowConfigs: true
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(inmos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const automationService = require('../services/automation.service');

// Autorizar/Activar una inmobiliaria y asignar días de plan
router.post('/activate', async (req, res) => {
    try {
        const { inmobiliariaId, days, planType } = req.body;

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + (parseInt(days) || 7));

        const updated = await prisma.inmobiliaria.update({
            where: { id: inmobiliariaId },
            data: {
                isActive: true,
                activatedAt: new Date(),
                expiresAt: expiresAt,
                planType: planType || 'PRO'
            }
        });

        // 🚀 Disparar automatización de infraestructura en segundo plano
        automationService.setupClientInfrastructure(inmobiliariaId).catch(err => {
            console.error('Fallo diferido en automatización:', err);
        });

        res.json({ message: 'Inmobiliaria activada e infraestructura en proceso de despliegue', updated });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Suspender una inmobiliaria
router.post('/suspend', async (req, res) => {
    try {
        const { inmobiliariaId } = req.body;

        const updated = await prisma.inmobiliaria.update({
            where: { id: inmobiliariaId },
            data: { isActive: false }
        });

        res.json({ message: 'Inmobiliaria suspendida', updated });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ver logs de seguridad (intentos de abuso)
router.get('/security-logs', async (req, res) => {
    try {
        const logs = await prisma.securityLog.findMany({
            orderBy: { createdAt: 'desc' },
            take: 100
        });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Crear usuario e inmobiliaria manualmente
router.post('/users', async (req, res) => {
    try {
        const { email, password, name, companyName, planType, days } = req.body;

        const exists = await prisma.user.findUnique({ where: { email } });
        if (exists) return res.status(400).json({ error: 'El email ya está registrado' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + (parseInt(days) || 30));

        const result = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: 'CLIENT',
                inmobiliaria: {
                    create: {
                        name: name,
                        companyName: companyName,
                        planType: planType || 'PRO',
                        isActive: true,
                        activatedAt: new Date(),
                        expiresAt: expiresAt
                    }
                }
            },
            include: { inmobiliaria: true }
        });

        res.json({ message: 'Usuario creado manualmente con éxito', user: { id: result.id, email: result.email } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Eliminar usuario
router.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.inmobiliaria.deleteMany({ where: { userId: id } });
        await prisma.user.delete({ where: { id } });
        res.json({ message: 'Usuario e infraestructura eliminada permanentemente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Cambiar contraseña de un usuario por el admin
router.post('/change-password', async (req, res) => {
    try {
        const { userId, newPassword } = req.body;
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: userId },
            data: {
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpires: null
            }
        });

        res.json({ message: 'Contraseña actualizada con éxito por el administrador' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
