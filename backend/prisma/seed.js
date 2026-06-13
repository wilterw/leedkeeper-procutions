const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
    const adminEmail = 'admin@econos.io';
    const adminPassword = await bcrypt.hash('SML123456', 10);

    const admin = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            email: adminEmail,
            password: adminPassword,
            name: 'Super Admin',
            role: 'ADMIN'
        }
    });

    console.log('✅ Admin user created/updated:', admin.email);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
