/**
 * Script para agregar el campo role a la tabla usuarios y crear un usuario admin
 * Ejecutar: node add-admin-role.js
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function addAdminRole() {
  try {
    console.log('🔄 Iniciando migración del campo role...');

    // Paso 1: Verificar si la columna role ya existe
    const tableInfo = await prisma.$queryRaw`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'Usuario' AND column_name = 'role'
    `;

    if (tableInfo.length === 0) {
      console.log('⚠️  La columna role no existe. Ejecuta primero: npx prisma migrate deploy --name add_role_field');
      console.log('O manualmente agrega la columna:');
      console.log('ALTER TABLE "Usuario" ADD COLUMN "role" VARCHAR(10) DEFAULT \'USER\';');
      return;
    }

    console.log('✅ Columna role existe');

    // Paso 2: Crear usuario admin si no existe
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@akahlclub.com';

    const existingAdmin = await prisma.usuario.findUnique({
      where: { email: adminEmail }
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(
        process.env.ADMIN_PASSWORD || 'Admin2024!',
        10
      );

      const admin = await prisma.usuario.create({
        data: {
          email: adminEmail,
          passwordHash: hashedPassword,
          fullName: 'Administrador',
          firstName: 'Admin',
          lastName: 'System',
          phone: '+1234567890',
          country: 'US',
          status: 'ACTIVE',
          tier: 'ORO',
          role: 'ADMIN',
          isTemporaryPassword: true,
          source: 'MANUAL'
        }
      });

      console.log('✅ Usuario admin creado:', adminEmail);
      console.log('⚠️  Por favor cambia la contraseña temporal en el primer login');
    } else {
      console.log('ℹ️  Usuario admin ya existe, actualizando role a ADMIN...');
      await prisma.usuario.update({
        where: { email: adminEmail },
        data: { role: 'ADMIN' }
      });
      console.log('✅ Role actualizado a ADMIN para:', adminEmail);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

addAdminRole();
