const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    const es = await prisma.contenido.count({ where: { idioma: 'es' } });
    const en = await prisma.contenido.count({ where: { idioma: 'en' } });
    const total = await prisma.contenido.count();

    console.log('📊 Base de datos:');
    console.log(`   - Total: ${total}`);
    console.log(`   - Español (es): ${es}`);
    console.log(`   - Inglés (en): ${en}`);

    // Mostrar algunos ejemplos
    const ejemplos = await prisma.contenido.findMany({
      take: 5,
      select: { titulo: true, idioma: true, tipo: true }
    });

    console.log('\n📝 Ejemplos de contenido:');
    ejemplos.forEach(ej => {
      console.log(`   - [${ej.idioma}] ${ej.tipo}: ${ej.titulo}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
