/**
 * ============================================
 * 🚀 PORTAL VIP + CATÁLOGO AKAHL ATELIER
 * SERVIDOR PRINCIPAL - ESTRUCTURA MODULAR
 * ============================================
 *
 * 📁 ESTRUCTURA:
 * ├── middleware/          - Middleware compartido
 * ├── config/              - Configuración compartida
 * ├── modules/
 * │   ├── VIP/            - 🎩 Módulo de Membresías VIP
 * │   │   ├── routes/
 * │   │   ├── controllers/
 * │   │   ├── prisma/
 * │   │   └── services/
 * │   └── CATALOGO/       - 🧵 Módulo Catálogo (AKAHL Atelier)
 * │       ├── routes/
 * │       ├── controllers/
 * │       └── prisma/
 *
 * 🔌 ENDPOINTS POR MÓDULO:
 *
 * 🎩 VIP (Portal de Membresías):
 * ├── /api/auth/*              - Autenticación VIP
 * ├── /api/contenido/*         - Contenido premium
 * ├── /api/usuarios/*          - Gestión de usuarios
 * ├── /api/stripe/*            - Pagos Stripe
 * ├── /api/admin/*             - Panel admin VIP
 * ├── /api/leads/*             - Captura de leads
 * └── /api/members/*           - Gestión de miembros
 *
 * 🧵 CATÁLOGO (AKAHL Atelier):
 * ├── /api/catalogo/auth/*     - Autenticación por PIN
 * ├── /api/catalogo/fabrics/*  - Gestión de telas
 * └── /api/catalogo/pricing/*  - Precios y cotizaciones
 */

const express = require('express');
const cors = require('cors');

// ============================================
// 📦 IMPORTS - MÓDULO VIP
// ============================================
const { router: vipAuthRoutes, authMiddleware } = require('./modules/VIP/routes/authRoutes');
const vipContenidoRoutes = require('./modules/VIP/routes/contenidoRoutes');
const vipUsuarioRoutes = require('./modules/VIP/routes/usuarioRoutes');
const vipStripeRoutes = require('./modules/VIP/routes/stripeRoutes');
const vipAdminRoutes = require('./modules/VIP/routes/adminRoutes');
const vipLeadsRoutes = require('./modules/VIP/routes/leadsRoutes');
const vipMembersRoutes = require('./modules/VIP/routes/membersRoutes');
const vipStripeWebhookRouter = require('./modules/VIP/routes/stripeWebhookRouter');

// ============================================
// 📦 IMPORTS - MÓDULO CATÁLOGO
// ============================================
const catalogoAuthRoutes = require('./modules/CATALOGO/routes/authRoutes');
const catalogoFabricsRoutes = require('./modules/CATALOGO/routes/fabricsRoutes');
const catalogoPricingRoutes = require('./modules/CATALOGO/routes/pricingRoutes');

// ============================================
// 🔧 CONFIGURACIÓN DEL SERVIDOR
// ============================================
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware CORS mejorado
const corsOptions = {
  origin: function (origin, callback) {
    // Permitir cualquier origen (incluyendo Vercel y localhost)
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

// Aplicar CORS ANTES de todas las rutas
app.use(cors(corsOptions));

// Middleware para responder manualmente a OPTIONS (preflight)
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    return res.sendStatus(200);
  }
  next();
});

// ⚠️ IMPORTANTE: El webhook de Stripe debe ir ANTES de express.json()
// porque necesita el body crudo para verificar la firma
app.use('/api/stripe/webhook', vipStripeWebhookRouter);

app.use(express.json());

// ============================================
// 📍 RUTA DE INICIO
// ============================================
app.get('/', (req, res) => {
  res.json({
    message: '🚀 API Portal VIP + Catálogo AKAHL Atelier funcionando',
    modules: {
      vip: '🎩 Módulo de Membresías VIP',
      catalogo: '🧵 Módulo Catálogo (AKAHL Atelier)'
    },
    endpoints: {
      vip: {
        base: '/api',
        auth: '/api/auth/*',
        contenido: '/api/contenido',
        usuarios: '/api/usuarios',
        stripe: '/api/stripe',
        admin: '/api/admin',
        leads: '/api/leads',
        members: '/api/members'
      },
      catalogo: {
        base: '/api/catalogo',
        auth: '/api/catalogo/auth/verify-pin',
        fabrics: '/api/catalogo/fabrics/*',
        pricing: '/api/catalogo/pricing/*'
      }
    }
  });
});

// ============================================
// 🎩 RUTAS DEL MÓDULO VIP
// ============================================
app.use('/api/auth', vipAuthRoutes);
app.use('/api/contenido', authMiddleware, vipContenidoRoutes);
app.use('/api/leads', vipLeadsRoutes);
app.use('/api/usuarios', vipUsuarioRoutes);
app.use('/api/stripe', vipStripeRoutes);
app.use('/api/admin', vipAdminRoutes);
app.use('/api/members', vipMembersRoutes);

// ============================================
// 🧵 RUTAS DEL MÓDULO CATÁLOGO (AKAHL ATELIER)
// ============================================
// Autenticación por PIN exclusiva del Catálogo
app.use('/api/catalogo/auth', catalogoAuthRoutes);

// Gestión de telas
app.use('/api/catalogo/fabrics', catalogoFabricsRoutes);

// Precios y cotizaciones
app.use('/api/catalogo/pricing', catalogoPricingRoutes);

// ============================================
// 🚀 INICIAR SERVIDOR
// ============================================
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║           🚀 SERVIDOR INICIADO                             ║
╠════════════════════════════════════════════════════════════╣
║  Puerto: ${PORT}
║  Entorno: ${process.env.NODE_ENV || 'development'}
╠════════════════════════════════════════════════════════════╣
║  📦 MÓDULOS ACTIVOS:                                     ║
║                                                          ║
║  🎩 VIP              → /api/*                           ║
║  🧵 CATÁLOGO         → /api/catalogo/*                   ║
╠════════════════════════════════════════════════════════════╣
║  🔗 ENDPOINTS:                                           ║
║                                                          ║
║  VIP:                                                    ║
║    /api/auth/*         - Autenticación VIP              ║
║    /api/contenido      - Contenido premium              ║
║    /api/stripe         - Pagos Stripe                   ║
║                                                          ║
║  CATÁLOGO:                                              ║
║    /api/catalogo/auth  - Auth por PIN                   ║
║    /api/catalogo/fabrics - Telas                       ║
║    /api/catalogo/pricing - Precios                     ║
╚════════════════════════════════════════════════════════════╝
  `);
});
