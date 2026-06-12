const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const antiAbuseMiddleware = require('../middleware/antiAbuse.middleware');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

// Registro de nueva inmobiliaria con medidas de seguridad
router.post('/register', antiAbuseMiddleware, async (req, res) => {
    try {
        const { email, password, name, companyName, fingerprint } = req.body;
        const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return res.status(400).json({ error: 'El email ya está registrado' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: 'CLIENT',
                inmobiliaria: {
                    create: {
                        name: companyName || name,
                        companyName: companyName,
                        registrationIp: ipAddress,
                        registrationFingerprint: fingerprint,
                        isActive: false, // Requiere autorización del admin
                        planType: 'DEMO'
                    }
                }
            },
            include: { inmobiliaria: true }
        });

        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
        res.status(201).json({
            message: 'Registro exitoso. Tu cuenta está pendiente de activación por el administrador.',
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                inmobiliariaId: user.inmobiliaria?.id
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login con verificación de estado y rol
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({
            where: { email },
            include: { inmobiliaria: true }
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

        // Registrar log de login
        await prisma.securityLog.create({
            data: {
                ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                action: 'LOGIN',
                email: user.email
            }
        });

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                inmobiliariaId: user.inmobiliaria?.id,
                isActive: user.inmobiliaria?.isActive,
                expiresAt: user.inmobiliaria?.expiresAt
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
