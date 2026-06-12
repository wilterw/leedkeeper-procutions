const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Middleware para proteger rutas con JWT
 */
const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            include: { inmobiliaria: true }
        });

        if (!user) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido o expirado' });
    }
};

module.exports = authMiddleware;
