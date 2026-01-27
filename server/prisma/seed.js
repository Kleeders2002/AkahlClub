const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // --- Usuarios de ejemplo ---
  const usuarios = [
    {
      email: 'penelope@akahl.com',
      password: '123456', // Para pruebas, luego en producción hashear
      nombre: 'Penelope',
      plan: 'ORO',
    },
    {
      email: 'alex@akahl.com',
      password: '123456',
      nombre: 'Alex',
      plan: 'ORO',
    },
    {
      email: 'maria@akahl.com',
      password: '123456',
      nombre: 'Maria',
      plan: 'PLATA',
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

  console.log('✅ Seed completado con éxito');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
