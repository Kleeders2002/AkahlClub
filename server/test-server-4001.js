const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 4001; // Puerto diferente

// CORS
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('API funcionando en puerto 4001 ✅');
});

// Login de prueba con base de datos real
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  console.log("📧 Intento de login para:", email);

  try {
    const user = await prisma.usuario.findUnique({ where: { email } });
    console.log("👤 Usuario encontrado:", user ? "Sí" : "No");

    if (!user) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    console.log("📊 Datos del usuario:");
    console.log("  - email:", user.email);
    console.log("  - status:", user.status);
    console.log("  - tier:", user.tier);
    console.log("  - status === 'ACTIVE':", user.status === 'ACTIVE');

    if (user.status !== 'ACTIVE') {
      return res.status(403).json({
        success: false,
        message: "Tu membresía está pendiente de pago",
        needsPayment: true,
        checkoutUrl: null
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    console.log("🔐 Contraseña coincide:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Contraseña incorrecta" });
    }

    console.log("✅ Login exitoso");

    res.json({
      success: true,
      message: "Login exitoso",
      token: "test-jwt-token-123",
      user: {
        id: user.id,
        email: user.email,
        nombre: user.fullName,
        plan: user.tier,
      },
    });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ success: false, message: "Error del servidor", error: error.message });
  }
});

// Iniciar servidor
const server = app.listen(PORT, () => {
  console.log(`Servidor de prueba corriendo en http://localhost:${PORT}`);
});

// Mantener el servidor corriendo
process.on('SIGINT', () => {
  console.log('\nCerrando servidor...');
  server.close();
  process.exit(0);
});
