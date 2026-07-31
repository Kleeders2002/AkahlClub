/**
 * ============================================================
 *  INTEGRACIÓN DEL COTIZADOR AL SERVIDOR PRINCIPAL
 * ============================================================
 *
 *  Agrega estas líneas a tu server/api.js
 *
 *  1. Agrega los require de las rutas (después de línea 8)
 *  2. Agrega los app.use de las rutas (después de línea 57)
 */

// ============================================================
//  1. AGREGAR ESTOS IMPORTS (después de línea 8)
// ============================================================

const fabricRoutes = require('../cotizador-api/routes/fabrics.prisma.js');
const pricingRoutes = require('../cotizador-api/routes/pricing.prisma.js');


// ============================================================
//  2. AGREGAR ESTAS RUTAS (después de línea 57, antes del app.listen)
// ============================================================

// 🧵 RUTAS DEL COTIZADOR (telas y precios)
// Estas rutas usan su propio middleware de autenticación
app.use('/api/fabrics', fabricRoutes);
app.use('/api/pricing', pricingRoutes);


// ============================================================
//  RESULTADO: server/api.js quedaría así:
// ============================================================

/*
const express = require('express');
const cors = require('cors');
const contenidoRoutes = require('./routes/contenidoRoutes');
const { router: authRoutes, authMiddleware } = require('./routes/authRoutes');
const leadsRoutes = require('./routes/leads');
const usuarioRoutes = require('./routes/usuarioRoutes');
const stripeRoutes = require('./routes/stripeRoutes');
const adminRoutes = require('./routes/adminRoutes');

// ⭐ NUEVO: Importar rutas del cotizador
const fabricRoutes = require('../cotizador-api/routes/fabrics.prisma.js');
const pricingRoutes = require('../cotizador-api/routes/pricing.prisma.js');

const app = express();
const PORT = process.env.PORT || 4000;

// ... [middleware CORS, express.json, etc] ...

// Rutas existentes
app.use('/api/auth', authRoutes);
app.use('/api/contenido', authMiddleware, contenidoRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/admin', adminRoutes);

// ⭐ NUEVO: Rutas del cotizador
app.use('/api/fabrics', fabricRoutes);
app.use('/api/pricing', pricingRoutes);

// Servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
*/
