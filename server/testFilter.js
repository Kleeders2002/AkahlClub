const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testFilter() {
  try {
    console.log('🔍 Probando filtrado por idioma...\n');

    // Probar filtrar por español
    const contenidoES = await prisma.contenido.findMany({
      where: { idioma: 'es' },
      select: { titulo: true, idioma: true, tipo: true }
    });

    console.log(`📚 Español (es): ${contenidoES.length} elementos`);
    contenidoES.forEach(c => console.log(`   - [${c.idioma}] ${c.tipo}: ${c.titulo.substring(0, 50)}...`));

    console.log('\n' + '='.repeat(60) + '\n');

    // Probar filtrar por inglés
    const contenidoEN = await prisma.contenido.findMany({
      where: { idioma: 'en' },
      select: { titulo: true, idioma: true, tipo: true }
    });

    console.log(`📖 Inglés (en): ${contenidoEN.length} elementos`);
    contenidoEN.forEach(c => console.log(`   - [${c.idioma}] ${c.tipo}: ${c.titulo.substring(0, 50)}...`));

    console.log('\n✅ Filtrado funcionando correctamente');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testFilter();
