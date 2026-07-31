/**
 * Pricing Routes
 * Rutas de precios - AKAHL Cotizador API
 */

const express = require('express');
const router = express.Router();
const pricingController = require('../controllers/pricingController');

// Middleware de autenticación (debe existir en tu proyecto)
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied' });
  }

  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ success: false, message: 'Invalid token' });
  }
};

/**
 * @route   GET /api/pricing/config
 * @desc    Obtener configuración de precios (multiplicadores)
 * @access  Private (requiere token)
 */
router.get('/config', authenticateToken, pricingController.getPricingConfig);

/**
 * @route   PUT /api/pricing/multipliers
 * @desc    Actualizar multiplicadores de precio
 * @access  Admin only
 */
router.put('/multipliers', authenticateToken, pricingController.updateMultipliers);

/**
 * @route   POST /api/pricing/calculate
 * @desc    Calcular precio de una prenda
 * @access  Private (requiere token)
 */
router.post('/calculate', authenticateToken, pricingController.calculatePrice);

module.exports = router;
