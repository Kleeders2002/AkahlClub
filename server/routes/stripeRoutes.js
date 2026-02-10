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
      success_url: `${process.env.FRONTEND_URL || 'https://akahl-club.vercel.app'}/login?stripe=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'https://akahl-club.vercel.app'}/membership?cancelled=true`,
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
      return_url: `${process.env.FRONTEND_URL || 'https://akahl-club.vercel.app'}/dashboard`
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
