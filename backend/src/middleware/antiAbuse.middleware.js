const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Middleware para prevenir abusos en el registro (múltiples cuentas demo)
 */
const antiAbuseMiddleware = async (req, res, next) => {
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const { fingerprint, email } = req.body;

    try {
        // 1. Verificar si la IP ya tiene una cuenta Demo en los últimos 30 días
        const existingByIp = await prisma.inmobiliaria.findFirst({
            where: {
                registrationIp: ipAddress,
                planType: 'DEMO',
                createdAt: {
                    gte: new Date(new Date().setDate(new Date().getDate() - 30))
                }
            }
        });

        if (existingByIp) {
            return res.status(403).json({
                error: 'Seguridad',
                message: 'Ya se ha registrado una cuenta Demo desde esta conexión recientemente.'
            });
        }

        // 2. Verificar por huella digital (Fingerprint)
        if (fingerprint) {
            const existingByFingerprint = await prisma.inmobiliaria.findFirst({
                where: {
                    registrationFingerprint: fingerprint,
                    planType: 'DEMO'
                }
            });

            if (existingByFingerprint) {
                return res.status(403).json({
                    error: 'Seguridad',
                    message: 'Este dispositivo ya tiene una cuenta registrada.'
                });
            }
        }

        // Registrar el intento en el log de seguridad
        await prisma.securityLog.create({
            data: {
                ipAddress,
                fingerprint: fingerprint || 'unknown',
                action: 'REGISTER_ATTEMPT',
                email
            }
        });

        next();
    } catch (error) {
        console.error('Error en antiAbuseMiddleware:', error);
        next(); // Dejamos pasar si hay error en el log para no bloquear legítimos, pero logueamos
    }
};

module.exports = antiAbuseMiddleware;
