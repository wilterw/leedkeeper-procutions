const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
    try {
        const hashedPassword = await bcrypt.hash('SML123456', 10);

        const admin = await prisma.user.upsert({
            where: { email: 'admin@econos.io' },
            update: {
                // Actualizamos la contraseña por si acaso decidieron cambiarla
                password: hashedPassword,
                role: 'ADMIN'
            },
            create: {
                email: 'admin@econos.io',
                password: hashedPassword,
                name: 'Super Admin',
                role: 'ADMIN'
            }
        });

        console.log('✅ Super Admin verificado/creado:', admin.email);
    } catch (error) {
        console.error('❌ Error asegurando admin:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
