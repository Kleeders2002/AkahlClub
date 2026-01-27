const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 4000;

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
  res.send('API funcionando ✅');
});

// Login de prueba sin base de datos
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  console.log("📧 Intento de login para:", email);

  if (email === 'kleesteban27@gmail.com' && password === '1234') {
    res.json({
      success: true,
      message: "Login exitoso",
      token: "test-token-123",
      user: {
        id: "test-id",
        email: email,
        nombre: "Kleesteban",
        plan: "ORO",
      },
    });
  } else {
    res.status(401).json({
      success: false,
      message: "Credenciales incorrectas"
    });
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
