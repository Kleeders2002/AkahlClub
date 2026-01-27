const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function fixPassword() {
  const hashedPassword = await bcrypt.hash('123456', 10);
  
  await prisma.usuario.updateMany({
    data: {
      password: hashedPassword
    }
  });
  
  console.log('✅ Contraseñas actualizadas con hash');
  process.exit();
}

fixPassword();