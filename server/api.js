const express = require('express');
const cors = require('cors');
const contenidoRoutes = require('./routes/contenidoRoutes');
const { router: authRoutes, authMiddleware } = require('./routes/authRoutes');
const leadsRoutes = require('./routes/leads'); // Importar arriba

const app = express();
const PORT = process.env.PORT || 4000;

// CORS
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());

// Rutas
app.get('/', (req, res) => {
  res.send('API del portal VIP funcionando ✅');
});

app.use('/api/auth', authRoutes);
app.use('/api/contenido', authMiddleware, contenidoRoutes);
app.use('/api/leads', leadsRoutes); // ✅ Sin authMiddleware

// Servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`); // ✅ CORREGIDO
  console.log(`CORS configurado para permitir cualquier origen`); // ✅ CORREGIDO
});