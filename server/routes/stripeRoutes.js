const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const { PrismaClient } = require('@prisma/client');
const { enviarEmailPagoConfirmado } = require('../services/emailService');

const prisma = new PrismaClient();

// Inicializar Stripe con la secret key
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Endpoint para verificar configuración
router.get('/test-config', async (req, res) => {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({
        success: false,
        message: 'STRIPE_SECRET_KEY no configurada'
      });
    }

    if (!process.env.STRIPE_PRICE_PLATA || !process.env.STRIPE_PRICE_ORO) {
      return res.status(500).json({
        success: false,
        message: 'Price IDs no configurados'
      });
    }

    res.json({
      success: true,
      message: 'Stripe configuration is valid',
      products: {
        plata: process.env.STRIPE_PRICE_PLATA,
        oro: process.env.STRIPE_PRICE_ORO
      }
    });
  } catch (error) {
    console.error('❌ Error verificando configuración de Stripe:', error);
    res.status(500).json({
      success: false,
      message: 'Error verificando configuración'
    });
  }
});

// POST /api/stripe/create-checkout-session - Crear sesión de checkout
router.post('/create-checkout-session', async (req, res) => {
  const { email, nombre, plan, idioma } = req.body;

  console.log('💳 Creando sesión de checkout:', { email, plan, idioma });

  if (!email || !plan) {
    return res.status(400).json({
      success: false,
      message: 'Email y plan son requeridos'
    });
  }

  try {
    // Determinar el price ID según el plan
    const priceId = plan === 'ORO'
      ? process.env.STRIPE_PRICE_ORO
      : process.env.STRIPE_PRICE_PLATA;

    if (!priceId) {
      throw new Error(`Price ID no configurado para plan ${plan}`);
    }

    // Crear o recuperar customer de Stripe
    let customer;
    const existingCustomers = await stripe.customers.list({ email, limit: 1 });

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
      console.log('✅ Customer existente:', customer.id);
    } else {
      customer = await stripe.customers.create({
        email,
        name: nombre || email,
        metadata: {
          plan: plan
        }
      });
      console.log('✅ Nuevo customer creado:', customer.id);
    }

    // Crear sesión de checkout
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      success_url: `${process.env.FRONTEND_URL || 'https://akahlclub.com'}/portal?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'https://akahlclub.com'}/membership?cancelled=true`,
      metadata: {
        email,
        nombre: nombre || '',
        plan,
        idioma: idioma || 'es'
      },
      subscription_data: {
        metadata: {
          email,
          plan,
          idioma: idioma || 'es'
        }
      }
    });

    console.log('✅ Sesión de checkout creada:', session.id);

    res.json({
      success: true,
      sessionId: session.id,
      checkoutUrl: session.url
    });

  } catch (error) {
    console.error('❌ Error creando sesión de checkout:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al crear sesión de pago'
    });
  }
});

// POST /api/stripe/webhook - Recibir webhooks de Stripe
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  let data;

  try {
    // Verificar firma del webhook
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    data = event.data.object;
    console.log('🔔 Webhook recibido:', event.type);
  } catch (err) {
    console.error('❌ Error verificando webhook:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    // Manejar diferentes eventos
    switch (event.type) {
      case 'checkout.session.completed': {
        console.log('✅ Checkout completado');
        const { email, plan, idioma, nombre } = data.metadata;

        // Buscar o crear usuario en la BD
        let usuario = await prisma.usuario.findUnique({ where: { email } });

        if (!usuario) {
          // Crear usuario si no existe
          const nameParts = (nombre || email).trim().split(' ');
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ') || '';

          usuario = await prisma.usuario.create({
            data: {
              email,
              fullName: nombre || email,
              firstName,
              lastName,
              passwordHash: '', // Sin password aún
              tier: plan || 'PLATA',
              status: 'ACTIVE',
              source: 'FORM',
              metadata: {
                stripeCustomerId: data.customer,
                stripeSubscriptionId: data.subscription
              }
            }
          });
          console.log('✅ Usuario creado desde Stripe:', usuario.id);
        } else {
          // Actualizar usuario existente a ACTIVE
          usuario = await prisma.usuario.update({
            where: { email },
            data: {
              status: 'ACTIVE',
              tier: plan || usuario.tier,
              metadata: {
                ...usuario.metadata,
                stripeCustomerId: data.customer,
                stripeSubscriptionId: data.subscription
              }
            }
          });
          console.log('✅ Usuario activado:', usuario.id);
        }

        // Enviar email de confirmación
        await enviarEmailPagoConfirmado(email, nombre || email, idioma || 'es');
        break;
      }

      case 'customer.subscription.updated': {
        console.log('🔄 Suscripción actualizada');
        const customerId = data.customer;

        // Buscar usuario por stripe customer ID
        const usuarios = await prisma.usuario.findMany();

        for (const u of usuarios) {
          if (u.metadata && u.metadata.stripeCustomerId === customerId) {
            const newStatus = data.status === 'active' ? 'ACTIVE' : 'INACTIVE';

            await prisma.usuario.update({
              where: { id: u.id },
              data: {
                status: newStatus,
                metadata: {
                  ...u.metadata,
                  stripeSubscriptionId: data.id
                }
              }
            });

            console.log(`✅ Usuario ${u.email} actualizado a ${newStatus}`);
            break;
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        console.log('❌ Suscripción cancelada');
        const customerId = data.customer;

        // Buscar y desactivar usuario
        const usuarios = await prisma.usuario.findMany();

        for (const u of usuarios) {
          if (u.metadata && u.metadata.stripeCustomerId === customerId) {
            await prisma.usuario.update({
              where: { id: u.id },
              data: {
                status: 'INACTIVE'
              }
            });

            console.log(`✅ Usuario ${u.email} desactivado`);
            break;
          }
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
        // Manejar pago fallido (opcional: enviar email al usuario)
        break;
      }

      default:
        console.log(`Evento no manejado: ${event.type}`);
    }

    res.json({ received: true });

  } catch (error) {
    console.error('❌ Error procesando webhook:', error);
    res.status(500).json({ error: 'Error procesando webhook' });
  }
});

// POST /api/stripe/create-portal-session - Crear sesión del Customer Portal
router.post('/create-portal-session', async (req, res) => {
  const { email } = req.body;

  console.log('🔐 Creando sesión del portal:', email);

  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Email es requerido'
    });
  }

  try {
    // Buscar usuario en la BD
    const usuario = await prisma.usuario.findUnique({ where: { email } });

    if (!usuario || !usuario.metadata || !usuario.metadata.stripeCustomerId) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no tiene suscripción activa'
      });
    }

    // Crear sesión del portal
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: usuario.metadata.stripeCustomerId,
      return_url: `${process.env.FRONTEND_URL || 'https://akahlclub.com'}/portal`
    });

    console.log('✅ Sesión del portal creada:', portalSession.id);

    res.json({
      success: true,
      portalUrl: portalSession.url
    });

  } catch (error) {
    console.error('❌ Error creando sesión del portal:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al crear sesión del portal'
    });
  }
});

// GET /api/stripe/subscription/:userId - Obtener estado de suscripción
router.get('/subscription/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: userId }
    });

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    if (!usuario.metadata || !usuario.metadata.stripeSubscriptionId) {
      return res.json({
        success: true,
        subscription: null,
        message: 'Usuario no tiene suscripción'
      });
    }

    // Obtener suscripción de Stripe
    const subscription = await stripe.subscriptions.retrieve(
      usuario.metadata.stripeSubscriptionId
    );

    res.json({
      success: true,
      subscription: {
        id: subscription.id,
        status: subscription.status,
        current_period_end: subscription.current_period_end,
        cancel_at_period_end: subscription.cancel_at_period_end,
        plan: subscription.items.data[0]?.price.nickname || 'Unknown'
      }
    });

  } catch (error) {
    console.error('❌ Error obteniendo suscripción:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener suscripción'
    });
  }
});

module.exports = router;
