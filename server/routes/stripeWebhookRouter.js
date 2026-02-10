const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const { PrismaClient } = require('@prisma/client');
const { enviarEmailPagoConfirmado } = require('../services/emailService');

const prisma = new PrismaClient();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// ⚠️ Este endpoint necesita el body RAW (no parseado) para verificar la firma
router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

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

    console.log('🔔 Webhook recibido:', event.type);
    console.log('📊 Event ID:', event.id);

  } catch (err) {
    console.error('❌ Error verificando webhook:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Enviamos respuesta 200 inmediatamente (Stripe necesita respuesta rápida)
  res.json({ received: true });

  // Procesamos el evento de forma asíncrona
  try {
    await processWebhookEvent(event);
  } catch (error) {
    console.error('❌ Error procesando evento:', error);
    // No enviamos error porque ya respondimos 200
  }
});

async function processWebhookEvent(event) {
  const data = event.data.object;

  switch (event.type) {
    case 'checkout.session.completed': {
      console.log('✅ Checkout completado');
      console.log('📧 Metadata:', data.metadata);

      const { email, plan, idioma, nombre } = data.metadata;

      if (!email) {
        console.error('❌ Email no encontrado en metadata');
        return;
      }

      // Buscar si el usuario ya existe
      let usuario = await prisma.usuario.findUnique({ where: { email } });

      if (usuario) {
        console.log('📝 Usuario ya existe, actualizando...');
        // Actualizar usuario existente
        usuario = await prisma.usuario.update({
          where: { email },
          data: {
            status: 'ACTIVE',
            tier: plan || usuario.tier,
            metadata: {
              ...(usuario.metadata || {}),
              stripeCustomerId: data.customer,
              stripeSubscriptionId: data.subscription
            }
          }
        });
      } else {
        console.log('👤 Creando nuevo usuario...');

        // Crear contraseña temporal
        const tempPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10);
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        // Separar nombre y apellido
        const nameParts = (nombre || email).trim().split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        // Crear nuevo usuario
        usuario = await prisma.usuario.create({
          data: {
            email,
            fullName: nombre || email,
            firstName,
            lastName,
            passwordHash: hashedPassword,
            tier: plan || 'PLATA',
            status: 'ACTIVE',
            source: 'STRIPE',
            metadata: {
              stripeCustomerId: data.customer,
              stripeSubscriptionId: data.subscription,
              tempPassword: tempPassword // Guardar password temporal por si acaso
            }
          }
        });

        console.log('✅ Usuario creado desde Stripe:', usuario.id);
      }

      console.log('✅ Usuario activado:', usuario.email, 'Status:', usuario.status, 'Tier:', usuario.tier);

      // Enviar email de confirmación
      await enviarEmailPagoConfirmado(email, nombre || email, idioma || 'es');
      console.log('📧 Email de confirmación enviado a:', email);

      break;
    }

    case 'customer.subscription.updated': {
      console.log('🔄 Suscripción actualizada');
      const customerId = data.customer;

      // Buscar usuario por stripeCustomerId en metadata
      const usuarios = await prisma.usuario.findMany({
        where: {
          metadata: {
            path: ['stripeCustomerId'],
            equals: customerId
          }
        }
      });

      if (usuarios.length > 0) {
        const usuario = usuarios[0];
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
      const usuarios = await prisma.usuario.findMany({
        where: {
          metadata: {
            path: ['stripeCustomerId'],
            equals: customerId
          }
        }
      });

      if (usuarios.length > 0) {
        const usuario = usuarios[0];

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
