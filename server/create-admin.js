/**
 * Script para crear un usuario admin específico
 * Ejecutar: node create-admin.js
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const adminEmail = 'kleeders@admin.com';
    const adminPassword = 'admin1234';

    console.log('🔐 Creando usuario admin...');

    // Verificar si ya existe
    const existingAdmin = await prisma.usuario.findUnique({
      where: { email: adminEmail }
    });

    if (existingAdmin) {
      console.log('ℹ️  Usuario ya existe, actualizando role a ADMIN...');

      // Actualizar a admin
      const updated = await prisma.usuario.update({
        where: { email: adminEmail },
        data: { role: 'ADMIN' }
      });

      // Si no tiene contraseña, asignar una
      if (!updated.passwordHash) {
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        await prisma.usuario.update({
          where: { email: adminEmail },
          data: {
            passwordHash: hashedPassword,
            isTemporaryPassword: true
          }
        });
        console.log('✅ Contraseña asignada');
      }

      console.log('✅ Usuario actualizado como ADMIN:', adminEmail);
      console.log('🔑 Email:', adminEmail);
      console.log('🔑 Contraseña:', adminPassword);
    } else {
      // Crear nuevo usuario admin
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      const admin = await prisma.usuario.create({
        data: {
          email: adminEmail,
          passwordHash: hashedPassword,
          fullName: 'Administrador',
          firstName: 'Kleeders',
          lastName: 'Admin',
          phone: '+1234567890',
          country: 'US',
          status: 'ACTIVE',
          tier: 'ORO',
          role: 'ADMIN',
          isTemporaryPassword: true,
          source: 'MANUAL'
        }
      });

      console.log('✅ Usuario admin creado exitosamente!');
      console.log('📧 Email:', adminEmail);
      console.log('🔑 Contraseña:', adminPassword);
      console.log('⚠️  La contraseña está marcada como temporal - deberás cambiarla en el primer login');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('Unique constraint')) {
      console.log('ℹ️  El email ya está registrado en la base de datos');
    }
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
