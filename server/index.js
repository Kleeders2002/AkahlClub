import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// Puerto
const PORT = process.env.PORT || 5000;

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API del Portal VIP funcionando' });
});

// Importar rutas
import contenidoRoutes from './routes/contenidoRoutes.js';
import usuarioRoutes from './routes/usuarioRoutes.js';

// Usar rutas
app.use('/api/contenido', contenidoRoutes);
app.use('/api/usuarios', usuarioRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal!' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});