/**
 * Script completo para configurar el sistema admin
 * 1. Aplica migración (agrega campo role)
 * 2. Crea usuario admin kleeders@admin.com
 *
 * Ejecutar: node setup-admin.js
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function setupAdmin() {
  try {
    console.log('🔄 Iniciando configuración de admin system...');

    // ============================================
    // PASO 1: Verificar/agregar campo role
    // ============================================
    console.log('\n📋 Paso 1: Verificando campo role en tabla Usuario...');

    try {
      // Intentar consultar una columna que no existe dará error
      await prisma.$queryRaw`
        SELECT "role" FROM "Usuario" LIMIT 1
      `;
      console.log('✅ Campo role ya existe');
    } catch (error) {
      if (error.message.includes('column') || error.message.includes('does not exist')) {
        console.log('⚠️  Campo role no existe. Aplicando migración...');

        // Aplicar migración usando SQL raw
        await prisma.$queryRaw`
          ALTER TABLE "Usuario" ADD COLUMN "role" VARCHAR(10) DEFAULT 'USER'
        `;
        console.log('✅ Campo role agregado');

        await prisma.$queryRaw`
          ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_role_check" CHECK ("role" IN ('USER', 'ADMIN'))
        `;
        console.log('✅ Constraint de role agregado');
      } else {
        throw error;
      }
    }

    // ============================================
    // PASO 2: Regenerar Prisma Client
    // ============================================
    console.log('\n📋 Paso 2: Regenerando Prisma Client...');
    const { execSync } = require('child_process');
    try {
      execSync('npx prisma generate', { cwd: process.cwd() });
      console.log('✅ Prisma Client regenerado');
    } catch (error) {
      console.log('⚠️  No se pudo regenerar Prisma Client (puede que ya esté actualizado)');
    }

    // ============================================
    // PASO 3: Crear usuario admin
    // ============================================
    console.log('\n📋 Paso 3: Creando usuario admin...');

    const adminEmail = 'kleeders@admin.com';
    const adminPassword = 'admin1234';

    // Verificar si ya existe
    const existingAdmin = await prisma.usuario.findUnique({
      where: { email: adminEmail }
    });

    if (existingAdmin) {
      console.log('ℹ️  Usuario ya existe. Actualizando a role ADMIN...');

      // Hashear contraseña si no tiene
      let passwordHash = existingAdmin.passwordHash;
      if (!passwordHash) {
        passwordHash = await bcrypt.hash(adminPassword, 10);
      }

      await prisma.usuario.update({
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

      await prisma.usuario.create({
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
    // RESUMEN
    // ============================================
    console.log('\n' + '='.repeat(50));
    console.log('✅ CONFIGURACIÓN COMPLETADA');
    console.log('='.repeat(50));
    console.log('\n📧 Credenciales de acceso:');
    console.log('   Email:    kleeders@admin.com');
    console.log('   Password: admin1234');
    console.log('   Rol:      ADMIN');
    console.log('\n🌐 Accede al panel en:');
    console.log('   http://localhost:5173/login');
    console.log('   (serás redirigido a /admin automáticamente)');
    console.log('\n⚠️  IMPORTANTE: Cambia la contraseña en el primer login');
    console.log('='.repeat(50) + '\n');

  } catch (error) {
    console.error('\n❌ Error durante la configuración:', error.message);
    console.error('\nDetalles:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupAdmin();
