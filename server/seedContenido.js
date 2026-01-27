const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedContenido() {
  try {
    console.log('🌱 Iniciando seed de contenido...');

    // Limpiar contenido existente
    await prisma.contenido.deleteMany({});
    console.log('✅ Contenido anterior eliminado');

    // Datos completos con idioma
    const contenidoData = [
      // GUIAS EN ESPAÑOL (3)
      {
        titulo: "Guía Completa de Trajes Formales para Caballeros",
        descripcion: "Domina el arte de elegir, usar y combinar trajes formales para cualquier ocasión. Aprende sobre cortes, telas, colores y accesorios que elevarán tu elegancia.",
        tipo: "GUIA",
        url: "/guias/trajes-formales-completo.pdf",
        premium: true,
        duracion: null,
        autor: null,
        paginas: 45,
        categoria: "Formal",
        thumbnailUrl: null,
        idioma: "es"
      },
      {
        titulo: "Manual de Combinación de Colores y Paletas",
        descripcion: "Descubre cómo crear combinaciones impecables. Guía exhaustiva sobre teoría del color aplicada al vestuario masculino contemporáneo.",
        tipo: "GUIA",
        url: "/guias/combinacion-colores.pdf",
        premium: true,
        duracion: null,
        autor: null,
        paginas: 38,
        categoria: "Color",
        thumbnailUrl: null,
        idioma: "es"
      },
      {
        titulo: "Guía de Etiqueta Corporativa y Business Casual",
        descripcion: "Todo lo que necesitas saber para vestir exitosamente en entornos profesionales sin perder tu identidad personal.",
        tipo: "GUIA",
        url: "/guias/etiqueta-corporativa.pdf",
        premium: false,
        duracion: null,
        autor: null,
        paginas: 32,
        categoria: "Profesional",
        thumbnailUrl: null,
        idioma: "es"
      },

      // GUIAS EN INGLÉS (2)
      {
        titulo: "Premium Footwear Curation: The Perfect Shoe Guide",
        descripcion: "Specialized guide on footwear types, materials, care, and how to match them with different clothing styles.",
        tipo: "GUIA",
        url: "/guias/calzado-premium.pdf",
        premium: true,
        duracion: null,
        autor: null,
        paginas: 28,
        categoria: "Accessories",
        thumbnailUrl: null,
        idioma: "en"
      },
      {
        titulo: "Elegance Craftsmanship: Caring for Exclusive Garments",
        descripcion: "Learn professional techniques to keep your premium garments in impeccable condition. Washing, ironing, and expert storage.",
        tipo: "GUIA",
        url: "/guias/cuidado-prendas.pdf",
        premium: false,
        duracion: null,
        autor: null,
        paginas: 25,
        categoria: "Maintenance",
        thumbnailUrl: null,
        idioma: "en"
      },

      // E-BOOKS EN ESPAÑOL (3)
      {
        titulo: "El Manual Definitivo del Estilo Atemporal Masculino",
        descripcion: "Un exhaustivo compendio de 180 páginas que cubre todos los aspectos del estilo clásico que trasciende tendencias pasajeras.",
        tipo: "EBOOK",
        url: "/ebooks/manual-estilo-atemporal.pdf",
        premium: true,
        duracion: null,
        autor: "Alexander Kent",
        paginas: 180,
        categoria: "Estilo",
        thumbnailUrl: null,
        idioma: "es"
      },
      {
        titulo: "Elegancia Europea: Lecciones de Italia y Francia",
        descripcion: "Descubre los secretos del sartorialismo europeo. Tradiciones, técnicas y filosofía de la elegancia mediterránea.",
        tipo: "EBOOK",
        url: "/ebooks/elegancia-europea.pdf",
        premium: true,
        duracion: null,
        autor: "Marco Benedetti",
        paginas: 145,
        categoria: "Internacional",
        thumbnailUrl: null,
        idioma: "es"
      },
      {
        titulo: "Armario Cápsula: Los 50 Items Esenciales",
        descripcion: "Guía completa para construir un armario versátil y sofisticado con 50 piezas clave que combinarán entre sí.",
        tipo: "EBOOK",
        url: "/ebooks/armario-capsula.pdf",
        premium: false,
        duracion: null,
        autor: "AKAHL Style Team",
        paginas: 95,
        categoria: "Práctico",
        thumbnailUrl: null,
        idioma: "es"
      },

      // E-BOOKS EN INGLÉS (2)
      {
        titulo: "Psychology of Dress: Impact on Leadership",
        descripcion: "In-depth analysis of how your personal appearance influences perceptions, opportunities, and professional outcomes.",
        tipo: "EBOOK",
        url: "/ebooks/psicologia-vestir.pdf",
        premium: true,
        duracion: null,
        autor: "Dr. Robert Sterling",
        paginas: 120,
        categoria: "Development",
        thumbnailUrl: null,
        idioma: "en"
      },
      {
        titulo: "Invest in Quality: Smart Shopping Guide",
        descripcion: "Learn to identify quality garments, where to invest, and how to build a wardrobe that will last decades.",
        tipo: "EBOOK",
        url: "/ebooks/compras-inteligentes.pdf",
        premium: false,
        duracion: null,
        autor: "AKAHL Style Team",
        paginas: 78,
        categoria: "Shopping",
        thumbnailUrl: null,
        idioma: "en"
      },

      // VIDEOS EN ESPAÑOL (3)
      {
        titulo: "Masterclass: Atando un Corbete Perfecto - 7 Estilos",
        descripcion: "Tutorial completo paso a paso mostrando los nudos de corbata más elegantes para cada ocasión formal.",
        tipo: "VIDEO",
        url: "https://vimeo.com/akahl/corbetes-perfectos",
        premium: true,
        duracion: "18:45",
        autor: "AKAHL Academy",
        paginas: null,
        categoria: "Tutoriales",
        thumbnailUrl: null,
        idioma: "es"
      },
      {
        titulo: "Tour por la Sastría: Proceso de Confección Artesanal",
        descripcion: "Documental exclusivo mostrando cómo se crean los trajes AKAHL desde la selección de telas hasta el toque final.",
        tipo: "VIDEO",
        url: "https://vimeo.com/akahl/tour-sastreria",
        premium: true,
        duracion: "25:30",
        autor: "AKAHL Productions",
        paginas: null,
        categoria: "Behind the Scenes",
        thumbnailUrl: null,
        idioma: "es"
      },
      {
        titulo: "5 Errores Comunes que Destruyen tu Elegancia",
        descripcion: "Análisis visual de los fallos más frecuentes en el vestuario masculino y cómo corregirlos fácilmente.",
        tipo: "VIDEO",
        url: "https://vimeo.com/akahl/errores-comunes",
        premium: false,
        duracion: "14:20",
        autor: "Alexander Kent",
        paginas: null,
        categoria: "Tips",
        thumbnailUrl: null,
        idioma: "es"
      },

      // VIDEOS EN INGLÉS (2)
      {
        titulo: "Color Analysis: Finding Your Personal Palette",
        descripcion: "Practical workshop to identify colors that best complement your skin tone, hair, and eyes.",
        tipo: "VIDEO",
        url: "https://vimeo.com/akahl/color-analysis",
        premium: true,
        duracion: "22:15",
        autor: "Color Consultants Team",
        paginas: null,
        categoria: "Workshop",
        thumbnailUrl: null,
        idioma: "en"
      },
      {
        titulo: "Casual Friday: Elegance Without a Suit",
        descripcion: "How to maintain a high level of sophistication in casual elegant dress environments.",
        tipo: "VIDEO",
        url: "https://vimeo.com/akahl/casual-elegante",
        premium: false,
        duracion: "16:40",
        autor: "AKAHL Academy",
        paginas: null,
        categoria: "Casual",
        thumbnailUrl: null,
        idioma: "en"
      },

      // TIPS EN ESPAÑOL (3)
      {
        titulo: "La Regla del Tercio: Proporciones Perfectas en tu Outfit",
        descripcion: "Divide tu outfit visualmente en tres partes: superior, media (cintura), e inferior. Este equilibrio crea siluetas armoniosas.",
        tipo: "TIP",
        url: "",
        premium: false,
        duracion: null,
        autor: null,
        paginas: null,
        categoria: "Proporción",
        thumbnailUrl: null,
        idioma: "es"
      },
      {
        titulo: "Invierte en los Fundamentos: El Poder de las Basics",
        descripcion: "Camisas blancas impecables, pantalones bien cortados y zapatos de calidad son la base. Con estos elementos, cualquier outfit funcionará.",
        tipo: "TIP",
        url: "",
        premium: true,
        duracion: null,
        autor: null,
        paginas: null,
        categoria: "Estrategia",
        thumbnailUrl: null,
        idioma: "es"
      },
      {
        titulo: "Menos es Más: El Arte de Sofisticar con Simplicidad",
        descripcion: "La elegancia máxima no requiere ostentación. Un outfit bien ajustado, limpio y coordinado habla más que marcas llamativas.",
        tipo: "TIP",
        url: "",
        premium: true,
        duracion: null,
        autor: null,
        paginas: null,
        categoria: "Filosofía",
        thumbnailUrl: null,
        idioma: "es"
      },

      // TIPS EN INGLÉS (2)
      {
        titulo: "Details Make the Difference: Intentional Accessories",
        descripcion: "A classic watch, Italian silk tie, discreet cufflinks. These subtle details communicate attention and refinement.",
        tipo: "TIP",
        url: "",
        premium: false,
        duracion: null,
        autor: null,
        paginas: null,
        categoria: "Accessories",
        thumbnailUrl: null,
        idioma: "en"
      },
      {
        titulo: "The Importance of Fit: Tailoring as Investment",
        descripcion: "No garment, no matter how expensive, looks good if it doesn't fit perfectly. An expert tailor is your best ally.",
        tipo: "TIP",
        url: "",
        premium: true,
        duracion: null,
        autor: null,
        paginas: null,
        categoria: "Tailoring",
        thumbnailUrl: null,
        idioma: "en"
      }
    ];

    // Insertar todo el contenido
    for (const item of contenidoData) {
      await prisma.contenido.create({ data: item });
    }

    const total = contenidoData.length;
    console.log(`\n🎉 Seed completado: ${total} elementos de contenido creados`);
    console.log('\n📊 Resumen:');
    console.log(`   - Guías: 5 (3 español, 2 inglés)`);
    console.log(`   - E-Books: 5 (3 español, 2 inglés)`);
    console.log(`   - Videos: 5 (3 español, 2 inglés)`);
    console.log(`   - Tips: 5 (3 español, 2 inglés)`);
    console.log(`   - Total español: 12`);
    console.log(`   - Total inglés: 8`);
    console.log('\n🌍 Idiomas implementados: es | en');

  } catch (error) {
    console.error('❌ Error en seed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedContenido();
