// Script para verificar el estado de un usuario
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUser(email) {
  console.log('🔍 Buscando usuario:', email);

  const user = await prisma.usuario.findUnique({
    where: { email }
  });

  if (!user) {
    console.log('❌ Usuario NO encontrado');
    return;
  }

  console.log('✅ Usuario encontrado:');
  console.log('📧 Email:', user.email);
  console.log('👤 Nombre:', user.fullName);
  console.log('📊 Status:', user.status);
  console.log('💎 Tier:', user.tier);
  console.log('🔐 Tiene passwordHash:', user.passwordHash ? 'Sí' : 'No');
  console.log('🔑 isTemporaryPassword:', user.isTemporaryPassword);
  console.log('📅 Fecha de creación:', user.createdAt);

  // Verificar si puede hacer login
  if (user.status !== 'ACTIVE') {
    console.log('\n⚠️  El usuario NO puede hacer login porque su status NO es ACTIVE');
    console.log('   Status actual:', user.status);
    console.log('   Necesita: Completar el pago para activar la cuenta');
  } else {
    console.log('\n✅ El usuario PUEDE hacer login (status es ACTIVE)');
  }
}

// Ejecutar con el email del usuario
checkUser('kleesteban27@gmail.com')
  .then(() => process.exit(0))
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
