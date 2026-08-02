/**
 * 🔐 AUTH ROUTES - CATÁLOGO (AKAHL ATELIER)
 *
 * Sistema de autenticación por PIN para el cotizador
 * Este módulo es exclusivo del CATÁLOGO, no del VIP
 *
 * ÚNICO ENDPOINT: POST /api/catalogo/auth/verify-pin
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const { validatePin } = require('../../../../config/pins');
const { JWT_SECRET } = require('../../../../middleware/auth');

const router = express.Router();

/**
 * POST /api/catalogo/auth/verify-pin
 * Verifica un PIN de 4 dígitos y retorna un JWT temporal
 *
 * Este endpoint es usado exclusivamente por el CATÁLOGO (sistema AKAHL Atelier)
 */
router.post('/verify-pin', async (req, res) => {
  const { pin } = req.body;

  console.log('🔐 [CATÁLOGO] Verificación de PIN:', pin ? '****' : null);

  // Validaciones
  if (!pin) {
    return res.status(400).json({
      success: false,
      message: 'PIN es requerido'
    });
  }

  // Validar formato de 4 dígitos
  if (!/^\d{4}$/.test(pin)) {
    return res.status(400).json({
      success: false,
      message: 'PIN debe tener exactamente 4 dígitos'
    });
  }

  // Verificar PIN usando configuración centralizada
  const pinConfig = validatePin(pin);

  if (!pinConfig) {
    console.log('❌ [CATÁLOGO] PIN inválido');
    return res.status(401).json({
      success: false,
      message: 'PIN inválido'
    });
  }

  // Generar JWT para el CATÁLOGO
  const tokenPayload = {
    id: `catalogo-${pinConfig.role}`, // ID virtual para CATÁLOGO
    email: `${pinConfig.role.toLowerCase()}@catalogo.akahl`, // Email virtual
    nombre: pinConfig.name,
    role: pinConfig.role,
    plan: pinConfig.role === 'ADMIN' ? 'ORO' : 'PLATA',
    must_change_pwd: false,
    source: 'catalogo_pin', // Marcar que viene del CATÁLOGO
    module: 'catalogo' // Identificar módulo
  };

  const token = jwt.sign(
    tokenPayload,
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  console.log('✅ [CATÁLOGO] PIN verificado, JWT generado para:', pinConfig.name);

  res.json({
    success: true,
    message: 'PIN verificado exitosamente',
    token,
    user: {
      name: pinConfig.name,
      role: pinConfig.role,
      permissions: pinConfig.permissions
    }
  });
});

module.exports = router;
