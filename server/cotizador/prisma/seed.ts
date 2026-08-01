/**
 * SEED SCRIPT - COTIZADOR AKAHL
 *
 * Este script carga datos de ejemplo en la base de datos:
 * 1. Colección SUPERNOVA (si no existe)
 * 2. Telas de SUPERNOVA (códigos 1425000, 1425001, etc.)
 * 3. Tipos de prenda básicos (si no existen)
 *
 * USO:
 *   npx tsx seed.ts
 *   o agregar en package.json: "prisma": { "seed": "tsx seed.ts" }
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ============================================================
// DATOS DE TELAS - SUPERNOVA COLLECTION
// ============================================================const SUPERNOVA_FABRICS = [
  {
    codigo: '1425000',
    color: 'SUPERNOVA 1425000',
    precio_por_yarda: 130.00,
    descuento: 0.35, // 35%
  },
  {
    codigo: '1425001',
    color: 'SUPERNOVA 1425001',
    precio_por_yarda: 130.00,
    descuento: 0.35,
  },
  {
    codigo: '1425002',
    color: 'SUPERNOVA 1425002',
    precio_por_yarda: 130.00,
    descuento: 0.35,
  },
  {
    codigo: '1425000-025',
    color: 'SUPERNOVA 1425000-025',
    precio_por_yarda: 130.00,
    descuento: 0.35,
  },
];

// ============================================================
// TIPOS DE PRENDA BASE (si no existen)
// ============================================================const BASE_GARMENT_TYPES = [
  {
    nombre: 'JACKET',
    codigo: 'jacket',
    yardas_requeridas: 2.50,
    costo_manufactura: 150.00,
    costo_envio: 25.00,
    costo_forro: 0,
    markup: 8.5, // Se sobreescribe con Multiplicador
  },
  {
    nombre: 'TROUSERS',
    codigo: 'trousers',
    yardas_requeridas: 1.80,
    costo_manufactura: 80.00,
    costo_envio: 15.00,
    costo_forro: 0,
    markup: 4.5,
  },
  {
    nombre: 'VEST',
    codigo: 'vest',
    yardas_requeridas: 1.20,
    costo_manufactura: 60.00,
    costo_envio: 10.00,
    costo_forro: 0,
    markup: 3.5,
  },
  {
    nombre: '2 PIECES',
    codigo: '2-piece-suit',
    yardas_requeridas: 4.30,
    costo_manufactura: 230.00,
    costo_envio: 40.00,
    costo_forro: 0,
    markup: 12.0,
  },
  {
    nombre: '3 PIECES',
    codigo: '3-piece-suit',
    yardas_requeridas: 5.50,
    costo_manufactura: 290.00,
    costo_envio: 50.00,
    costo_forro: 0,
    markup: 15.0,
  },
  {
    nombre: 'EXECUTIVE DRESS',
    codigo: 'dress-executive',
    yardas_requeridas: 3.00,
    costo_manufactura: 180.00,
    costo_envio: 30.00,
    costo_forro: 0,
    markup: 10.0,
  },
];

// ============================================================
// MAIN SEED FUNCTION
// ============================================================async function main() {
  console.log('🌱 Starting seed...');

  try {
    // 1. Crear/verificar colección SUPERNOVA
    console.log('📦 Creating/checking SUPERNOVA collection...');
    let coleccion = await prisma.coleccion.findUnique({
      where: { nombre: 'SUPERNOVA' }
    });

    if (!coleccion) {
      coleccion = await prisma.coleccion.create({
        data: {
          nombre: 'SUPERNOVA',
          proveedor: 'SUPERNOVA BRANDS',
          descuento_default: 0.35,
        }
      });
      console.log(`✅ Created collection: ${coleccion.nombre}`);
    } else {
      console.log(`✅ Collection exists: ${coleccion.nombre}`);
    }

    // 2. Crear/verificar tipos de prenda
    console.log('👔 Creating/checking garment types...');
    for (const tipo of BASE_GARMENT_TYPES) {
      const existing = await prisma.tipoPrenda.findUnique({
        where: { codigo: tipo.codigo }
      });

      if (!existing) {
        await prisma.tipoPrenda.create({
          data: tipo
        });
        console.log(`  ✅ Created: ${tipo.nombre}`);
      } else {
        console.log(`  ⏭️  Exists: ${tipo.nombre}`);
      }
    }

    // 3. Crear telas SUPERNOVA
    console.log('🧵 Creating SUPERNOVA fabrics...');
    let createdCount = 0;
    let updatedCount = 0;

    for (const fabric of SUPERNOVA_FABRICS) {
      // Verificar si ya existe
      const existing = await prisma.tela.findUnique({
        where: {
          id_coleccion_codigo: {
            id_coleccion: coleccion.id_coleccion,
            codigo: fabric.codigo
          }
        }
      });

      // Calcular precio_neto = precio_por_yarda * (1 - descuento)
      const precio_neto = fabric.precio_por_yarda * (1 - fabric.descuento);

      if (!existing) {
        await prisma.tela.create({
          data: {
            id_coleccion: coleccion.id_coleccion,
            codigo: fabric.codigo,
            color: fabric.color,
            precio_por_yarda: fabric.precio_por_yarda,
            descuento: fabric.descuento,
            precio_neto: precio_neto,
            disponibilidad: 'disponible',
            visible_publico: true,
          }
        });
        createdCount++;
        console.log(`  ✅ Created: ${fabric.codigo} - $${fabric.precio_por_yarda}/yd`);
      } else {
        // Actualizar si existe
        await prisma.tela.update({
          where: { id_tela: existing.id_tela },
          data: {
            precio_por_yarda: fabric.precio_por_yarda,
            descuento: fabric.descuento,
            precio_neto: precio_neto,
            color: fabric.color,
          }
        });
        updatedCount++;
        console.log(`  🔄 Updated: ${fabric.codigo}`);
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Created: ${createdCount} fabrics`);
    console.log(`   🔄 Updated: ${updatedCount} fabrics`);
    console.log(`   📦 Total in collection: ${createdCount + updatedCount}`);

    // 4. Mostrar estadísticas finales
    const totalFabrics = await prisma.tela.count();
    const totalGarments = await prisma.tipoPrenda.count();
    const totalCollections = await prisma.coleccion.count();

    console.log(`\n🎉 Seed completed!`);
    console.log(`   📦 Collections: ${totalCollections}`);
    console.log(`   🧵 Total Fabrics: ${totalFabrics}`);
    console.log(`   👑 Total Garment Types: ${totalGarments}`);

  } catch (error) {
    console.error('❌ Error during seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
