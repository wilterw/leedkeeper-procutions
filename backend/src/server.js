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
app.use(helmet());
app.use(cors({
    origin: ['http://localhost:5173', 'https://leedkeeper.econos.io'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.json({
        message: 'Lead Keeper API is running',
        status: 'UP',
        version: '1.0.0'
    });
});

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
