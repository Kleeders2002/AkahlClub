/**
 * PRISMA CLIENT - COTIZADOR API
 * Cliente compartido para todos los módulos del cotizador
 */

import { PrismaClient } from '@prisma/client'

// Singleton pattern para evitar múltiples instancias en desarrollo
const globalForPrisma = globalThis

const prisma =
  globalForPrisma.prisma_cotizador ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma_cotizador = prisma
}

export default prisma

// Middleware opcional para logs
prisma.$use(async (params, next) => {
  const before = Date.now()
  const result = await next(params)
  const after = Date.now()
  console.log(`Query ${params.model}.${params.action} took ${after - before}ms`)
  return result
})
