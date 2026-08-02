const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { enviarEmailBienvenidaGratis } = require('../../../services/emailService');

const prisma = new PrismaClient();

// Middleware para verificar token
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ success: false, message: 'No token proporcionado' });

  const token = authHeader.split(' ')[1];
  const jwt = require('jsonwebtoken');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token inválido o expirado' });
  }
};

// POST /api/usuarios/cancelar-suscripcion
router.post('/cancelar-suscripcion', authMiddleware, async (req, res) => {
  try {
    const { reason, feedback } = req.body;
    const userId = req.user.id;

    console.log('❌ Solicitud de cancelación de usuario:', userId);

    // Buscar usuario
    const user = await prisma.usuario.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Guardar la solicitud de cancelación en metadata
    const cancellationData = {
      requestedAt: new Date().toISOString(),
      reason: reason || 'No especificado',
      feedback: feedback || '',
      status: 'pending'
    };

    // Actualizar metadata del usuario
    const existingMetadata = user.metadata ? JSON.parse(user.metadata) : {};
    await prisma.usuario.update({
      where: { id: userId },
      data: {
        metadata: JSON.stringify({
          ...existingMetadata,
          cancellationRequest: cancellationData
        })
      }
    });

    // Enviar email de notificación al equipo de soporte
    // NOTA: Aquí podrías integrar con Systeme.io API si la tienen
    // Por ahora, solo registramos la solicitud

    console.log('✅ Solicitud de cancelación registrada para:', user.email);
    console.log('📝 Motivo:', reason);
    console.log('💬 Feedback:', feedback);

    res.json({
      success: true,
      message: 'Solicitud de cancelación recibida. Te contactaremos en 24-48 horas para confirmar.',
      requestId: `cancel_${Date.now()}`
    });

  } catch (err) {
    console.error('❌ Error al procesar cancelación:', err);
    res.status(500).json({
      success: false,
      message: 'Error del servidor al procesar la solicitud'
    });
  }
});

module.exports = router;
