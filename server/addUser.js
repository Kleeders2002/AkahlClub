const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function addUser() {
  try {
    // Datos del usuario
    const email = 'kleesteban27@gmail.com';
    const plainPassword = '1234';

    // Hashear la contraseña
    const passwordHash = await bcrypt.hash(plainPassword, 10);

    // Crear el usuario
    const user = await prisma.usuario.upsert({
      where: { email },
      update: {
        passwordHash,
        status: 'ACTIVE',
        tier: 'ORO'
      },
      create: {
        email,
        passwordHash,
        fullName: 'Kleesteban',
        firstName: 'Klee',
        lastName: 'Steban',
        status: 'ACTIVE',
        tier: 'ORO',
        source: 'MANUAL'
      }
    });

    console.log('✅ Usuario creado/actualizado exitosamente:');
    console.log('   Email:', user.email);
    console.log('   Nombre:', user.fullName);
    console.log('   Plan:', user.tier);
    console.log('   Estado:', user.status);
    console.log('   Contraseña:', plainPassword);

  } catch (error) {
    console.error('❌ Error al crear usuario:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addUser();
