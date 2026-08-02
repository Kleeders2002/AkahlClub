const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const { PrismaClient } = require('@prisma/client');
const { enviarEmailPagoConfirmado } = require('../../../services/emailService');

const prisma = new PrismaClient();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Endpoint de prueba para verificar webhook
router.get('/test', async (req, res) => {
  console.log('🧪 Endpoint de prueba del webhook ejecutado');

  const checks = {
    stripeSecretKey: !!process.env.STRIPE_SECRET_KEY,
    webhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
    frontendUrl: process.env.FRONTEND_URL,
    stripePricePlata: !!process.env.STRIPE_PRICE_PLATA,
    stripePriceOro: !!process.env.STRIPE_PRICE_ORO,
    databaseConnected: false
  };

  // Verificar conexión a BD
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.databaseConnected = true;
  } catch (dbError) {
    checks.databaseConnected = false;
    console.error('❌ Error de BD:', dbError.message);
  }

  res.json({
    success: true,
    message: 'Webhook test endpoint',
    checks,
    environment: {
      nodeEnv: process.env.NODE_ENV,
      port: process.env.PORT
    }
  });
});

// Endpoint para crear un usuario de prueba manualmente
router.post('/test-create-user', async (req, res) => {
  const { email, nombre } = req.body;

  console.log('🧪 Creando usuario de prueba manualmente');

  try {
    // Verificar si ya existe
    const existing = await prisma.usuario.findUnique({ where: { email } });
    if (existing) {
      return res.json({
        success: false,
        message: 'Usuario ya existe',
        user: existing
      });
    }

    // Crear usuario de prueba
    const tempPassword = 'test123456';
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const nameParts = (nombre || email).trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const usuario = await prisma.usuario.create({
      data: {
        email,
        fullName: nombre || email,
        firstName,
        lastName,
        passwordHash: hashedPassword,
        tier: 'PLATA',
        status: 'ACTIVE',
        source: 'MANUAL_TEST',
        metadata: {
          testUser: true
        }
      }
    });

    console.log('✅ Usuario de prueba creado:', usuario.id);

    res.json({
      success: true,
      message: 'Usuario de prueba creado',
      user: usuario,
      tempPassword // Solo para pruebas
    });

  } catch (error) {
    console.error('❌ Error creando usuario de prueba:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ⚠️ Este endpoint necesita el body RAW (no parseado) para verificar la firma
router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  console.log('==========================================');
  console.log('🔔 Webhook recibido');
  console.log('📋 Headers:', Object.keys(req.headers));
  console.log('✅ Tiene stripe-signature:', !!sig);
  console.log('✅ Tiene STRIPE_WEBHOOK_SECRET:', !!webhookSecret);

  let event;

  try {
    // Verificar firma del webhook
    if (!sig) {
      console.error('❌ No stripe-signature header');
      return res.status(400).json({ error: 'No stripe-signature header' });
    }

    if (!webhookSecret) {
      console.error('❌ STRIPE_WEBHOOK_SECRET no configurada');
      return res.status(500).json({ error: 'Webhook secret not configured' });
    }

    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);

    console.log('✅ Webhook verificado correctamente');
    console.log('🔔 Tipo de evento:', event.type);
    console.log('📊 Event ID:', event.id);

  } catch (err) {
    console.error('❌ Error verificando webhook:', err.message);
    console.error('❌ Stack trace:', err.stack);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Enviamos respuesta 200 inmediatamente (Stripe necesita respuesta rápida)
  res.json({ received: true });

  // Procesamos el evento de forma asíncrona
  try {
    await processWebhookEvent(event);
  } catch (error) {
    console.error('❌ Error procesando evento:', error);
    console.error('❌ Stack trace:', error.stack);
    // No enviamos error porque ya respondimos 200
  }
});

async function processWebhookEvent(event) {
  const data = event.data.object;

  switch (event.type) {
    case 'checkout.session.completed': {
      console.log('==========================================');
      console.log('✅ checkout.session.completed recibido');
      console.log('📊 Data completo:', JSON.stringify(data, null, 2));
      console.log('📧 Metadata:', data.metadata);

      const { email, plan, idioma, nombre } = data.metadata;

      console.log('📧 Email extraído:', email);
      console.log('👤 Nombre extraído:', nombre);
      console.log('🏷️ Plan extraído:', plan);
      console.log('🌍 Idioma extraído:', idioma);

      if (!email) {
        console.error('❌ Email no encontrado en metadata');
        console.error('❌ Metadata completa:', data.metadata);
        return;
      }

      // Buscar si el usuario ya existe
      console.log('🔍 Buscando usuario en base de datos...');
      let usuario = await prisma.usuario.findUnique({ where: { email } });

      // Generar contraseña temporal (se necesita en ambos casos)
      const tempPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10);
      console.log('🔑 Contraseña temporal generada:', tempPassword);

      if (usuario) {
        console.log('📝 Usuario ya existe, actualizando...');
        console.log('👤 Usuario antes de actualización:', usuario);

        // Actualizar usuario existente
        usuario = await prisma.usuario.update({
          where: { email },
          data: {
            status: 'ACTIVE',
            tier: plan || usuario.tier,
            metadata: {
              ...(usuario.metadata || {}),
              stripeCustomerId: data.customer,
              stripeSubscriptionId: data.subscription,
              tempPassword: tempPassword
            }
          }
        });

        console.log('✅ Usuario actualizado:', usuario);
      } else {
        console.log('👤 Creando nuevo usuario...');

        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        // Separar nombre y apellido
        const nameParts = (nombre || email).trim().split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        console.log('📝 Datos del nuevo usuario:');
        console.log('  - Email:', email);
        console.log('  - Nombre completo:', nombre || email);
        console.log('  - First name:', firstName);
        console.log('  - Last name:', lastName);
        console.log('  - Tier:', plan || 'PLATA');
        console.log('  - Status: ACTIVE');
        console.log('  - Source: FORM');

        // Crear nuevo usuario
        try {
          usuario = await prisma.usuario.create({
            data: {
              email,
              fullName: nombre || email,
              firstName,
              lastName,
              passwordHash: hashedPassword,
              tier: plan || 'PLATA',
              status: 'ACTIVE',
              source: 'FORM',
              metadata: {
                stripeCustomerId: data.customer,
                stripeSubscriptionId: data.subscription,
                tempPassword: tempPassword
              }
            }
          });

          console.log('✅✅✅ USUARIO CREADO EXITOSAMENTE ✅✅✅');
          console.log('👤 ID:', usuario.id);
          console.log('📧 Email:', usuario.email);
          console.log('🏷️ Tier:', usuario.tier);
          console.log('✅ Status:', usuario.status);
        } catch (createError) {
          console.error('❌❌❌ ERROR CREANDO USUARIO ❌❌❌');
          console.error('Error:', createError.message);
          console.error('Code:', createError.code);
          console.error('Stack:', createError.stack);
          throw createError;
        }
      }

      console.log('✅ Usuario final:', usuario.email, 'Status:', usuario.status, 'Tier:', usuario.tier);

      // Enviar email de confirmación con contraseña temporal
      console.log('📧 Enviando email de confirmación a:', email);
      try {
        await enviarEmailPagoConfirmado(email, nombre || email, tempPassword, idioma || 'es');
        console.log('✅ Email de confirmación enviado con contraseña temporal');
      } catch (emailError) {
        console.error('❌ Error enviando email:', emailError.message);
        // No fallamos el proceso si falla el email
      }

      break;
    }

    case 'customer.subscription.updated': {
      console.log('🔄 Suscripción actualizada');
      const customerId = data.customer;

      // Buscar usuario por stripeCustomerId en metadata
      // Debemos buscar en todos los usuarios y filtrar
      const allUsuarios = await prisma.usuario.findMany();

      const usuario = allUsuarios.find(u =>
        u.metadata && u.metadata.stripeCustomerId === customerId
      );

      if (usuario) {
        const newStatus = data.status === 'active' ? 'ACTIVE' : 'INACTIVE';

        await prisma.usuario.update({
          where: { id: usuario.id },
          data: {
            status: newStatus,
            metadata: {
              ...usuario.metadata,
              stripeSubscriptionId: data.id
            }
          }
        });

        console.log(`✅ Usuario ${usuario.email} actualizado a ${newStatus}`);
      } else {
        console.log('⚠️ No se encontró usuario con stripeCustomerId:', customerId);
      }
      break;
    }

    case 'customer.subscription.deleted': {
      console.log('❌ Suscripción cancelada');
      const customerId = data.customer;

      // Buscar usuario por stripeCustomerId en metadata
      const allUsuarios = await prisma.usuario.findMany();

      const usuario = allUsuarios.find(u =>
        u.metadata && u.metadata.stripeCustomerId === customerId
      );

      if (usuario) {
        await prisma.usuario.update({
          where: { id: usuario.id },
          data: {
            status: 'INACTIVE'
          }
        });

        console.log(`✅ Usuario ${usuario.email} desactivado`);
      } else {
        console.log('⚠️ No se encontró usuario con stripeCustomerId:', customerId);
      }
      break;
    }

    case 'invoice.payment_succeeded': {
      console.log('💰 Pago exitoso');
      // El pago se procesó exitosamente
      break;
    }

    case 'invoice.payment_failed': {
      console.log('⚠️ Pago fallido');
      // Opcional: enviar email al usuario sobre pago fallido
      break;
    }

    default:
      console.log(`ℹ️ Evento no manejado: ${event.type}`);
  }
}

module.exports = router;
