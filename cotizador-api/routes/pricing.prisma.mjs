/**
 * Pricing Routes - PRISMA VERSION
 * Rutas de precios - AKAHL Cotizador API
 *
 * Migrado a ES Modules + Prisma
 */

import express from 'express'
import * as pricingController from '../controllers/pricingController.prisma.mjs'

const router = express.Router()

/**
 * Middleware de autenticación
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied' })
  }

  try {
    let jwt
    try {
      jwt = require('jsonwebtoken')
    } catch {
      import('jsonwebtoken').then(m => { jwt = m.default })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
    req.user = decoded
    next()
  } catch (error) {
    res.status(403).json({ success: false, message: 'Invalid token' })
  }
}

/**
 * @route   GET /api/pricing/config
 * @desc    Obtener configuración de precios (tipos de prenda y multiplicadores)
 * @access  Private (requiere token)
 */
router.get('/config', authenticateToken, pricingController.getPricingConfig)

/**
 * @route   PUT /api/pricing/multipliers
 * @desc    Actualizar multiplicadores de precio
 * @access  Admin only
 */
router.put('/multipliers', authenticateToken, pricingController.updateMultipliers)

/**
 * @route   POST /api/pricing/calculate
 * @desc    Calcular precio de una prenda
 * @access  Private (requiere token)
 */
router.post('/calculate', authenticateToken, pricingController.calculatePrice)

/**
 * @route   GET /api/pricing/quotations
 * @desc    Obtener historial de cotizaciones
 * @access  Admin only
 */
router.get('/quotations', authenticateToken, pricingController.getQuotations)

/**
 * @route   GET /api/pricing/internal-view
 * @desc    Obtener vista interna de telas con costos completos
 * @access  Admin only
 */
router.get('/internal-view', authenticateToken, pricingController.getInternalView)

/**
 * @route   GET /api/pricing/public-catalog
 * @desc    Obtener vista pública del catálogo (sin costos)
 * @access  Public (no requiere autenticación para clientes)
 */
router.get('/public-catalog', pricingController.getPublicCatalog)

export default router
