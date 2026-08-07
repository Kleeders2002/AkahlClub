const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // --- Usuarios de ejemplo ---
  const usuarios = [
    {
      email: 'penelope@akahl.com',
      passwordHash: '123456', // Para pruebas, luego en producción hashear
      fullName: 'Penelope',
      tier: 'ORO',
    },
    {
      email: 'alex@akahl.com',
      passwordHash: '123456',
      fullName: 'Alex',
      tier: 'ORO',
    },
    {
      email: 'maria@akahl.com',
      passwordHash: '123456',
      fullName: 'Maria',
      tier: 'PLATA',
    }
  ];

  for (const u of usuarios) {
    await prisma.usuario.upsert({
      where: { email: u.email },
      update: {},
      create: u,
    });
  }

  // --- Contenido de ejemplo ---
  const contenido = [
    // Guias
    {
      titulo: "Guía Completa de Trajes Formales",
      descripcion: "Todo lo que necesitas para dominar tu estilo profesional",
      tipo: "GUIA",
      url: "/guias/trajes-formales.pdf",
      premium: false
    },
    {
      titulo: "Técnicas Avanzadas de Confección",
      descripcion: "Aprende los secretos detrás de nuestros diseños exclusivos",
      tipo: "GUIA",
      url: "/guias/confeccion-avanzada.pdf",
      premium: true
    },
    {
      titulo: "Análisis de Tendencias de Moda 2026",
      descripcion: "Descubre qué estilos dominarán este año",
      tipo: "GUIA",
      url: "/guias/tendencias-2026.pdf",
      premium: false
    },

    // Ebooks
    {
      titulo: "Manual de Estilo Akahl",
      descripcion: "Guía completa de vestimenta y combinaciones",
      tipo: "EBOOK",
      url: "/ebooks/manual-estilo.pdf",
      premium: false,
      autor: "Akahl Team",
      paginas: 150
    },
    {
      titulo: "Guía de Accesorios",
      descripcion: "Cómo complementar tu outfit con detalles perfectos",
      tipo: "EBOOK",
      url: "/ebooks/accesorios.pdf",
      premium: true,
      autor: "Akahl Team",
      paginas: 80
    },

    // Videos
    {
      titulo: "Cómo Elegir Tu Traje Ideal",
      descripcion: "Consejos de Alex para encontrar el fit perfecto",
      tipo: "VIDEO",
      url: "https://youtube.com/akahl-traje-ideal",
      premium: false,
      duracion: "12:34",
      thumbnailUrl: "/thumbs/traje-ideal.jpg"
    },
    {
      titulo: "Confección Paso a Paso",
      descripcion: "Video exclusivo mostrando el proceso de nuestros trajes ORO",
      tipo: "VIDEO",
      url: "https://youtube.com/akahl-confeccion",
      premium: true,
      duracion: "25:10",
      thumbnailUrl: "/thumbs/confeccion.jpg"
    },

    // Tips
    {
      titulo: "Combinación de Colores para Eventos",
      descripcion: "Cómo destacar sin perder elegancia",
      tipo: "TIP",
      url: "",
      premium: false,
      categoria: "Moda",
    },
    {
      titulo: "Cuidado de tus Trajes",
      descripcion: "Mantén tus prendas como nuevas por más tiempo",
      tipo: "TIP",
      url: "",
      premium: true,
      categoria: "Mantenimiento",
    }
  ];

  for (const c of contenido) {
    await prisma.contenido.upsert({
      where: { titulo: c.titulo },
      update: {},
      create: c,
    });
  }

  // ============================================================
  //  CATÁLOGO DE TELAS - AKAHL ATELIER
  // ============================================================

  console.log('🧵 Iniciando seed del catálogo de telas...');

  // --- 1. MARCAS ---
  const marcas = [
    { nombre: "Holland & Sherry" }
  ];

  for (const marca of marcas) {
    await prisma.marca.upsert({
      where: { id_marca: 1 },
      update: { nombre: marca.nombre },
      create: marca
    });
  }

  const hsMarca = await prisma.marca.findFirst({ where: { nombre: "Holland & Sherry" } });
  console.log(`✅ Marca creada: ${hsMarca.nombre}`);

  // --- 2. COLECCIONES ---
  const colecciones = [
    {
      id_marca: hsMarca.id_marca,
      nombre: "SUPERNOVA",
      descuento_default: 0.35  // 35%
    }
  ];

  for (const col of colecciones) {
    await prisma.coleccion.upsert({
      where: { id_coleccion: 1 },
      update: {},
      create: col
    });
  }

  const supernova = await prisma.coleccion.findFirst({ where: { nombre: "SUPERNOVA" } });
  console.log(`✅ Colección creada: ${supernova.nombre} (descuento: ${(supernova.descuento_default * 100)}%)`);

  // --- 3. TIPOS DE PRENDA ---
  const tiposPrenda = [
    {
      nombre: "JACKET",
      codigo: "jacket",
      yardas_requeridas: 2.5,
      costo_manufactura: 350,
      costo_envio: 150,
      costo_forro: 125,
      markup: 3
    },
    {
      nombre: "2 PIECES",
      codigo: "2-piece",
      yardas_requeridas: 4,
      costo_manufactura: 500,
      costo_envio: 175,
      costo_forro: 125,
      markup: 3
    },
    {
      nombre: "3 PIECES",
      codigo: "3-piece",
      yardas_requeridas: 5,
      costo_manufactura: 600,
      costo_envio: 200,
      costo_forro: 150,
      markup: 3
    },
    {
      nombre: "TROUSERS",
      codigo: "trousers",
      yardas_requeridas: 2,
      costo_manufactura: 150,
      costo_envio: 75,
      costo_forro: 0,
      markup: 3
    },
    {
      nombre: "VEST",
      codigo: "vest",
      yardas_requeridas: 1.75,
      costo_manufactura: 155,
      costo_envio: 75,
      costo_forro: 50,
      markup: 3
    }
  ];

  for (const tipo of tiposPrenda) {
    await prisma.tipoPrenda.upsert({
      where: { codigo: tipo.codigo },
      update: {
        yardas_requeridas: tipo.yardas_requeridas,
        costo_manufactura: tipo.costo_manufactura,
        costo_envio: tipo.costo_envio,
        costo_forro: tipo.costo_forro,
        markup: tipo.markup
      },
      create: tipo
    });
  }
  console.log(`✅ Tipos de prenda creados: ${tiposPrenda.length}`);

  // --- 4. TELAS (5 variantes SUPERNOVA) ---
  // Verificar si ya existen telas para no duplicar
  const existingTelas = await prisma.tela.count();
  if (existingTelas === 0) {
    const precio_por_yarda = 130;
    const descuento = 0.35; // 35%
    const precio_neto = precio_por_yarda * (1 - descuento); // = 84.5

    const telas = [
      { codigo: "1425000" },
      { codigo: "1425001" },
      { codigo: "1425002" },
      { codigo: "1425003" },
      { codigo: "1425004" }
    ];

    for (const tela of telas) {
      await prisma.tela.create({
        data: {
          id_coleccion: supernova.id_coleccion,
          codigo: tela.codigo,
          precio_por_yarda: precio_por_yarda,
          descuento: descuento,
          precio_neto: precio_neto
        }
      });
    }
    console.log(`✅ Telas creadas: ${telas.length} variantes SUPERNOVA`);
  } else {
    console.log(`⏭️  Telas ya existen (${existingTelas}), omitiendo...`);
  }

  console.log('✅ Seed completado con éxito');
  console.log('📊 Resumen:');
  console.log(`   - Marca: Holland & Sherry`);
  console.log(`   - Colección: SUPERNOVA`);
  console.log(`   - Tipos de prenda: ${tiposPrenda.length}`);
  console.log(`   - Telas: ${existingTelas === 0 ? 5 : existingTelas}`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
