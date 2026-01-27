const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifyUser() {
  try {
    const user = await prisma.usuario.findUnique({
      where: { email: 'kleesteban27@gmail.com' }
    });

    if (user) {
      console.log('✅ Usuario encontrado en base de datos:');
      console.log('   ID:', user.id);
      console.log('   Email:', user.email);
      console.log('   Nombre completo:', user.fullName);
      console.log('   Plan:', user.tier);
      console.log('   Estado:', user.status);
      console.log('   ¿Tiene contraseña?', !!user.passwordHash);
      console.log('   Fuente:', user.source);
      console.log('   Creado:', user.createdAt);
    } else {
      console.log('❌ Usuario no encontrado');
    }
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyUser();
