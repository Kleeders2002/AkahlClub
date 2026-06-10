// Script para arreglar la contraseña de un usuario específico
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function fixUserPassword(email, correctPassword) {
  console.log('🔧 Arreglando contraseña para:', email);
  console.log('🔑 Nueva contraseña:', correctPassword);

  const user = await prisma.usuario.findUnique({
    where: { email }
  });

  if (!user) {
    console.log('❌ Usuario NO encontrado');
    return;
  }

  console.log('\n📊 Datos actuales:');
  console.log('  Email:', user.email);
  console.log('  Nombre:', user.fullName);
  console.log('  Status:', user.status);
  console.log('  Tier:', user.tier);
  console.log('  isTemporaryPassword:', user.isTemporaryPassword);

  // Generar nuevo hash con la contraseña correcta
  console.log('\n🔐 Generando nuevo hash...');
  const hashedPassword = await bcrypt.hash(correctPassword, 10);

  // Actualizar usuario
  const updated = await prisma.usuario.update({
    where: { email },
    data: {
      passwordHash: hashedPassword,
      isTemporaryPassword: true
    }
  });

  console.log('\n✅ Contraseña actualizada exitosamente');
  console.log('📧 Ahora el usuario puede hacer login con:', correctPassword);
  console.log('🔐 Debe cambiar la contraseña al primer login');

  // Verificar que funcione
  const isMatch = await bcrypt.compare(correctPassword, updated.passwordHash);
  console.log('\n✅ Verificación:', isMatch ? 'La contraseña coincide' : 'Error: no coincide');
}

// Arreglar el usuario específico
fixUserPassword('kleesteban27@gmail.com', 'p17uhdhz6p6anbteo9nk')
  .then(() => process.exit(0))
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
