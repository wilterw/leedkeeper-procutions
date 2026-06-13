const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

// REEMPLAZA ESTO CON TU URL EXTERNA DE EASYPANEL
const DATABASE_URL = "URL_EXTERNA_AQUÍ";

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: DATABASE_URL,
        },
    },
});

async function createAdmin() {
    try {
        const hashedPassword = await bcrypt.hash('SML123456', 10);

        const admin = await prisma.user.upsert({
            where: { email: 'admin@econos.io' },
            update: {},
            create: {
                email: 'admin@econos.io',
                password: hashedPassword,
                name: 'Super Admin',
                role: 'ADMIN',
                status: 'ACTIVE'
            },
        });

        console.log('✅ Usuario Admin creado con éxito:', admin.email);
        console.log('📧 Email: admin@econos.io');
        console.log('🔑 Password: SML123456');
    } catch (error) {
        console.error('❌ Error creando admin:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createAdmin();
