// Script para crear productos y precios en Stripe
const Stripe = require('stripe');
require('dotenv').config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

async function createProductsAndPrices() {
  try {
    console.log('🚀 Creando productos en Stripe...\n');

    // Verificar que la API key existe
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY no está configurada en .env');
    }

    // Crear producto PLATA
    console.log('📦 Creando producto Akahl Club Plata...');
    const productPlata = await stripe.products.create({
      name: 'Akahl Club Plata',
      description: 'Membresía Silver - Acceso a comunidad WhatsApp, consejos semanales, newsletter mensual y descuentos especiales.',
      metadata: {
        tier: 'PLATA',
        features: JSON.stringify([
          'Acceso a grupo WhatsApp de la comunidad',
          'Consejos semanales de estilo y combinaciones',
          'Newsletter mensual con tips de moda',
          'Acceso a eventos gratuitos ocasionales',
          'Descuentos especiales en primera compra'
        ])
      }
    });
    console.log('✅ Producto Plata creado:', productPlata.id);

    // Crear precio PLATA
    console.log('💰 Creando precio para Akahl Club Plata...');
    const pricePlata = await stripe.prices.create({
      product: productPlata.id,
      unit_amount: 999, // $9.99 en centavos
      currency: 'usd',
      recurring: {
        interval: 'month'
      },
      nickname: 'Plan Plata - Mensual',
      metadata: {
        tier: 'PLATA'
      }
    });
    console.log('✅ Precio Plata creado:', pricePlata.id);
    console.log('   → Price ID:', pricePlata.id);
    console.log('   → Agregar a .env: STRIPE_PRICE_PLATA=' + pricePlata.id);
    console.log('');

    // Crear producto ORO
    console.log('📦 Creando producto Akahl Club Oro...');
    const productOro = await stripe.products.create({
      name: 'Akahl Club Oro',
      description: 'Membresía Gold - Acceso completo a biblioteca digital, consultas personalizadas, comunidad VIP y todos los beneficios premium.',
      metadata: {
        tier: 'ORO',
        features: JSON.stringify([
          'Todo lo del plan Plata',
          'Consultas por texto en vivo',
          'Evaluaciones de armario (15 min + evaluación por temporada)',
          'Biblioteca digital completa de e-books y guías',
          'Tutoriales y recursos exclusivos mensuales',
          'Acceso VIP a comunidad de WhatsApp',
          'Descuentos especiales en prendas personalizadas',
          'Acceso anticipado a lanzamientos y colecciones'
        ])
      }
    });
    console.log('✅ Producto Oro creado:', productOro.id);

    // Crear precio ORO
    console.log('💰 Creando precio para Akahl Club Oro...');
    const priceOro = await stripe.prices.create({
      product: productOro.id,
      unit_amount: 1999, // $19.99 en centavos
      currency: 'usd',
      recurring: {
        interval: 'month'
      },
      nickname: 'Plan Oro - Mensual',
      metadata: {
        tier: 'ORO'
      }
    });
    console.log('✅ Precio Oro creado:', priceOro.id);
    console.log('   → Price ID:', priceOro.id);
    console.log('   → Agregar a .env: STRIPE_PRICE_ORO=' + priceOro.id);
    console.log('');

    console.log('🎉 ¡Productos y precios creados exitosamente!\n');
    console.log('📝 Variables de entorno para Render:\n');
    console.log(`STRIPE_PRICE_PLATA=${pricePlata.id}`);
    console.log(`STRIPE_PRICE_ORO=${priceOro.id}`);
    console.log('');
    console.log('⚠️  IMPORTANTE: Copia estos Price IDs y agrégalos a tus variables de entorno en Render.');

  } catch (error) {
    console.error('❌ Error creando productos:', error.message);
    process.exit(1);
  }
}

// Ejecutar el script
createProductsAndPrices();
