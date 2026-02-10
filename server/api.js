const express = require('express');
const cors = require('cors');
const contenidoRoutes = require('./routes/contenidoRoutes');
const { router: authRoutes, authMiddleware } = require('./routes/authRoutes');
const leadsRoutes = require('./routes/leads');
const usuarioRoutes = require('./routes/usuarioRoutes');
const stripeRoutes = require('./routes/stripeRoutes');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware para CORS mejorado
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
const StripeWebhookRouter = require('./routes/stripeWebhookRouter');
app.use('/api/stripe/webhook', StripeWebhookRouter);

app.use(express.json());

// Rutas
app.get('/', (req, res) => {
  res.send('API del portal VIP funcionando ✅');
});

app.use('/api/auth', authRoutes);
app.use('/api/contenido', authMiddleware, contenidoRoutes);
app.use('/api/leads', leadsRoutes); // ✅ Sin authMiddleware
app.use('/api/usuarios', usuarioRoutes); // ✅ Rutas de usuarios
app.use('/api/stripe', stripeRoutes); // ✅ Rutas de Stripe (públicas y webhooks)

// Servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`); // ✅ CORREGIDO
  console.log(`CORS configurado para permitir cualquier origen`); // ✅ CORREGIDO
});