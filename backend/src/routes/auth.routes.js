const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendWelcomeEmail, sendResetPasswordEmail } = require('../services/email.service');
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

        // Enviar correo de bienvenida (async)
        sendWelcomeEmail(user.email, user.name);

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

// Solicitar recuperación
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.json({ message: 'Si el correo está registrado, recibirás un enlace pronto.' });

        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 3600000);

        await prisma.user.update({
            where: { email },
            data: { resetPasswordToken: token, resetPasswordExpires: expires }
        });

        await sendResetPasswordEmail(user.email, token);
        res.json({ message: 'Si el correo está registrado, recibirás un enlace pronto.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Resetear contraseña
router.post('/reset-password', async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const user = await prisma.user.findFirst({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: { gt: new Date() }
            }
        });
        if (!user) return res.status(400).json({ error: 'Token inválido o expirado' });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword, resetPasswordToken: null, resetPasswordExpires: null }
        });

        res.json({ message: 'Contraseña actualizada con éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
