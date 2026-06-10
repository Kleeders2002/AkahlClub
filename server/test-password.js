// Script para probar si la contraseña coincide
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function testPassword(email, testPassword) {
  console.log('🔍 Probando contraseña para:', email);
  console.log('🔑 Contraseña a probar:', testPassword);

  const user = await prisma.usuario.findUnique({
    where: { email }
  });

  if (!user) {
    console.log('❌ Usuario NO encontrado');
    return;
  }

  console.log('\n📊 Datos del usuario:');
  console.log('  Email:', user.email);
  console.log('  Tiene passwordHash:', user.passwordHash ? 'Sí' : 'No');
  console.log('  isTemporaryPassword:', user.isTemporaryPassword);

  if (!user.passwordHash) {
    console.log('\n❌ El usuario NO tiene contraseña establecida');
    return;
  }

  console.log('\n🔐 Probando comparación...');

  // Probar comparación
  const isMatch = await bcrypt.compare(testPassword, user.passwordHash);

  console.log('\n' + (isMatch ? '✅' : '❌') + ' Resultado:', isMatch ? 'LAS CONTRASEÑAS COINCIDEN' : 'LAS CONTRASEÑAS NO COINCIDEN');

  // Intentar generar un nuevo hash de la contraseña para comparar
  console.log('\n🔧 Generando nuevo hash de prueba...');
  const newHash = await bcrypt.hash(testPassword, 10);
  const newMatch = await bcrypt.compare(testPassword, newHash);
  console.log('  Nuevo hash coincide:', newMatch ? 'Sí' : 'No');

  // Comparar los hashes directamente
  console.log('\n📋 Comparación de hashes:');
  console.log('  Hash guardado:', user.passwordHash.substring(0, 20) + '...');
  console.log('  Hash de prueba:', newHash.substring(0, 20) + '...');
  console.log('  ¿Son iguales?:', user.passwordHash === newHash ? 'Sí' : 'No');
}

// Ejecutar con los datos proporcionados
testPassword('kleesteban27@gmail.com', 'p17uhdhz6p6anbteo9nk')
  .then(() => process.exit(0))
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
