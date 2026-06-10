/**
 * Script completo para configurar el sistema admin
 * 1. Crea enum UserRole
 * 2. Aplica migración (agrega campo role)
 * 3. Crea usuario admin kleeders@admin.com
 *
 * Ejecutar: node setup-admin-v2.js
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function setupAdmin() {
  let client;
  try {
    console.log('🔄 Iniciando configuración de admin system...');

    // ============================================
    // PASO 1: Crear enum UserRole en la BD
    // ============================================
    console.log('\n📋 Paso 1: Creando enum UserRole en PostgreSQL...');

    try {
      await prisma.$queryRaw`
        CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN')
      `;
      console.log('✅ Enum UserRole creado');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('✅ Enum UserRole ya existe');
      } else {
        console.log('⚠️  Error al crear enum:', error.message);
      }
    }

    // ============================================
    // PASO 2: Agregar campo role
    // ============================================
    console.log('\n📋 Paso 2: Verificando campo role en tabla Usuario...');

    try {
      await prisma.$queryRaw`
        SELECT "role" FROM "Usuario" LIMIT 1
      `;
      console.log('✅ Campo role ya existe');
    } catch (error) {
      if (error.message.includes('column') || error.message.includes('does not exist')) {
        console.log('⚠️  Campo role no existe. Aplicando migración...');

        await prisma.$queryRaw`
          ALTER TABLE "Usuario" ADD COLUMN "role" "UserRole" DEFAULT 'USER'
        `;
        console.log('✅ Campo role agregado con tipo UserRole');
      } else {
        throw error;
      }
    }

    // ============================================
    // PASO 3: Regenerar Prisma Client
    // ============================================
    console.log('\n📋 Paso 3: Regenerando Prisma Client...');
    const { execSync } = require('child_process');
    try {
      // Cerrar conexiones antes de regenerar
      await prisma.$disconnect();

      execSync('npx prisma generate', { cwd: process.cwd(), stdio: 'inherit' });
      console.log('✅ Prisma Client regenerado');

      // Reconectar
      const { PrismaClient: PrismaClientNew } = require('@prisma/client');
      client = new PrismaClientNew();
    } catch (error) {
      console.log('⚠️  Error regenerando Prisma Client:', error.message);
      // Intentar reconectar de todos modos
      const { PrismaClient: PrismaClientNew } = require('@prisma/client');
      client = new PrismaClientNew();
    }

    // Usar el cliente reconectado
    const prisma2 = client || prisma;

    // ============================================
    // PASO 4: Crear usuario admin
    // ============================================
    console.log('\n📋 Paso 4: Creando usuario admin...');

    const adminEmail = 'kleeders@admin.com';
    const adminPassword = 'admin1234';

    // Verificar si ya existe
    const existingAdmin = await prisma2.usuario.findUnique({
      where: { email: adminEmail }
    });

    if (existingAdmin) {
      console.log('ℹ️  Usuario ya existe. Actualizando a role ADMIN...');

      // Hashear contraseña si no tiene
      let passwordHash = existingAdmin.passwordHash;
      if (!passwordHash) {
        passwordHash = await bcrypt.hash(adminPassword, 10);
      }

      await prisma2.usuario.update({
        where: { email: adminEmail },
        data: {
          role: 'ADMIN',
          passwordHash: passwordHash,
          isTemporaryPassword: true,
          status: 'ACTIVE',
          tier: 'ORO'
        }
      });

      console.log('✅ Usuario actualizado como ADMIN');
    } else {
      // Crear nuevo usuario admin
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      await prisma2.usuario.create({
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

      console.log('✅ Usuario admin creado');
    }

    // ============================================
    // VERIFICACIÓN
    // ============================================
    console.log('\n📋 Paso 5: Verificando configuración...');

    const adminUser = await prisma2.usuario.findUnique({
      where: { email: adminEmail },
      select: {
        email: true,
        role: true,
        status: true,
        tier: true,
        fullName: true
      }
    });

    console.log('✅ Usuario verificado:', adminUser);

    // ============================================
    // RESUMEN
    // ============================================
    console.log('\n' + '='.repeat(50));
    console.log('✅ CONFIGURACIÓN COMPLETADA');
    console.log('='.repeat(50));
    console.log('\n📧 Credenciales de acceso:');
    console.log('   Email:    kleeders@admin.com');
    console.log('   Password: admin1234');
    console.log('   Rol:      ' + adminUser.role);
    console.log('   Estado:   ' + adminUser.status);
    console.log('   Plan:     ' + adminUser.tier);
    console.log('\n🌐 Accede al panel en:');
    console.log('   http://localhost:5173/login');
    console.log('   (serás redirigido a /admin automáticamente)');
    console.log('\n⚠️  IMPORTANTE: Cambia la contraseña en el primer login');
    console.log('='.repeat(50) + '\n');

  } catch (error) {
    console.error('\n❌ Error durante la configuración:', error.message);
    console.error('\nDetalles:', error);
  } finally {
    if (client) {
      await client.$disconnect();
    } else {
      await prisma.$disconnect();
    }
  }
}

setupAdmin();
