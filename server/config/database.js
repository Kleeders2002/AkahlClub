/**
 * 🗄️ CONFIGURACIÓN DE BASE DE DATOS
 * Cliente Prisma compartido para VIP y CATÁLOGO
 */

const { PrismaClient } = require('@prisma/client');

/**
 * Instancia única de Prisma Client
 * Usar esta instancia en toda la aplicación
 */
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
});

/**
 * Manejo graceful shutdown
 */
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

module.exports = {
  prisma
};
