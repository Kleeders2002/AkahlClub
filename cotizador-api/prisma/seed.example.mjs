// ============================================================
//  SEED DE EJEMPLO - COTIZADOR API
//  Datos de prueba para desarrollo
// ============================================================

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de cotizador-api...')

  // ============================================================
  //  1. Crear colecciones adicionales
  // ============================================================
  console.log('📦 Creando colecciones...')

  const supernova = await prisma.coleccion.upsert({
    where: { id_coleccion: 1 },
    update: {},
    create: {
      nombre: 'SUPERNOVA',
      proveedor: 'Loro Piana',
      descuento_default: 0.35,
    },
  })

  const dragonfly = await prisma.coleccion.upsert({
    where: { id_coleccion: 2 },
    update: {},
    create: {
      nombre: 'DRAGONFLY',
      proveedor: 'Ermenegildo Zegna',
      descuento_default: 0.30,
    },
  })

  // ============================================================
  //  2. Crear telas de ejemplo
  // ============================================================
  console.log('🧵 Creando telas...')

  // Telas SUPERNOVA
  await prisma.tela.createMany({
    data: [
      {
        id_coleccion: 1,
        codigo: '1425000-025',
        color: 'Navy Blue',
        precio_por_yarda: 85.00,
        descuento: 0.35,
        disponibilidad: 'disponible',
        visible_publico: true,
      },
      {
        id_coleccion: 1,
        codigo: '1425000-116',
        color: 'Charcoal Gray',
        precio_por_yarda: 95.00,
        descuento: 0.35,
        disponibilidad: 'disponible',
        visible_publico: true,
      },
      {
        id_coleccion: 1,
        codigo: '1425100-001',
        color: 'Pure Black',
        precio_por_yarda: 120.00,
        descuento: 0.35,
        disponibilidad: 'disponible',
        visible_publico: true,
      },
      {
        id_coleccion: 1,
        codigo: '1425200-042',
        color: 'Cream Beige',
        precio_por_yarda: 75.00,
        descuento: 0.35,
        disponibilidad: 'por_pedido',
        visible_publico: true,
      },
    ],
    skipDuplicates: true,
  })

  // Telas DRAGONFLY
  await prisma.tela.createMany({
    data: [
      {
        id_coleccion: 2,
        codigo: 'DF-3000-150',
        color: 'Burgundy',
        precio_por_yarda: 110.00,
        descuento: 0.30,
        disponibilidad: 'disponible',
        visible_publico: true,
      },
      {
        id_coleccion: 2,
        codigo: 'DF-3100-080',
        color: 'Forest Green',
        precio_por_yarda: 105.00,
        descuento: 0.30,
        disponibilidad: 'agotado',
        visible_publico: false, // Solo interno
      },
    ],
    skipDuplicates: true,
  })

  // ============================================================
  //  3. Multiplicadores de ejemplo (opcional)
  // ============================================================
  console.log('🔢 Creando multiplicadores...')

  await prisma.multiplicador.createMany({
    data: [
      { tipo_manufactura: 'bespoke', tipo_prenda_codigo: 'jacket', valor: 3.5 },
      { tipo_manufactura: 'industrial', tipo_prenda_codigo: 'jacket', valor: 2.8 },
    ],
    skipDuplicates: true,
  })

  console.log('✅ Seed completado exitosamente!')
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
