const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();
const authRoutes = require('./routes/auth.routes');
const clientRoutes = require('./routes/client.routes');
const whatsappRoutes = require('./routes/whatsapp.routes');
const adminRoutes = require('./routes/admin.routes');
const propertyRoutes = require('./routes/property.routes');
const onboardingRoutes = require('./routes/onboarding.routes');
const authMiddleware = require('./middleware/auth.middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: false
}));
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());

// Routes
const healthCheck = async (req, res) => {
    let dbStatus = 'UNKNOWN';
    try {
        await prisma.$queryRaw`SELECT 1`;
        dbStatus = 'CONNECTED';
    } catch (e) {
        dbStatus = 'ERROR: ' + e.message;
    }

    res.json({
        message: 'Lead Keeper API is running',
        status: 'UP',
        database: dbStatus,
        version: '1.0.0'
    });
};

app.get('/', healthCheck);
app.get('/api', healthCheck);

// Rutas de la API

app.use('/api/auth', authRoutes);

// Rutas protegidas
app.use('/api/clients', authMiddleware, clientRoutes);
app.use('/api/whatsapp', authMiddleware, whatsappRoutes);
app.use('/api/admin', authMiddleware, adminRoutes);
app.use('/api/properties', authMiddleware, propertyRoutes);
app.use('/api/onboarding', authMiddleware, onboardingRoutes);

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

app.listen(PORT, () => {
    console.log(`🚀 Lead Keeper Backend running on http://localhost:${PORT}`);
});
