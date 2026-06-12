const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
    const email = 'prueba@econos.io';
    const password = 'W16122002www';
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.upsert({
        where: { email: email },
        update: {
            password: hashedPassword,
            role: 'CLIENT'
        },
        create: {
            email: email,
            password: hashedPassword,
            name: 'Usuario Prueba',
            role: 'CLIENT',
            inmobiliaria: {
                create: {
                    name: 'Usuario Prueba',
                    companyName: 'Inmobiliaria Demo',
                    isActive: true,
                    planType: 'PRO'
                }
            }
        }
    });

    console.log('✅ User created for testing:', user.email);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
