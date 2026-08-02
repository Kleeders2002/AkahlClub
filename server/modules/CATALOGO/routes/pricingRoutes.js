/**
 * 💰 PRICING ROUTES - CATÁLOGO (AKAHL ATELIER)
 * Rutas de precios y cotizaciones para el sistema de cotización
 *
 * Este módulo es exclusivo del CATÁLOGO
 */

const express = require('express');
const pricingController = require('../controllers/pricingController');
const { authMiddleware } = require('../../../../middleware/auth');
const { adminMiddleware } = require('../../../../middleware/admin');

const router = express.Router();

/**
 * @route   GET /api/pricing/config
 * @desc    Obtener configuración de precios (tipos de prenda y multiplicadores)
 * @access  Public (AKAHL Atelier usa PIN local)
 */
router.get('/config', pricingController.getPricingConfig)

/**
 * @route   PUT /api/pricing/multipliers
 * @desc    Actualizar multiplicadores de precio
 * @access  Admin only
 */
router.put('/multipliers', authMiddleware, adminMiddleware, pricingController.updateMultipliers)

/**
 * @route   POST /api/pricing/calculate
 * @desc    Calcular precio de una prenda
 * @access  Public (AKAHL Atelier usa PIN local)
 */
router.post('/calculate', pricingController.calculatePrice)

/**
 * @route   GET /api/pricing/quotations
 * @desc    Obtener historial de cotizaciones
 * @access  Admin only
 */
router.get('/quotations', authMiddleware, adminMiddleware, pricingController.getQuotations)

/**
 * @route   GET /api/pricing/internal-view
 * @desc    Obtener vista interna de telas con costos completos
 * @access  Admin only
 */
router.get('/internal-view', authMiddleware, adminMiddleware, pricingController.getInternalView)

/**
 * @route   GET /api/pricing/public-catalog
 * @desc    Obtener vista pública del catálogo (sin costos)
 * @access  Public (no requiere autenticación para clientes)
 */
router.get('/public-catalog', pricingController.getPublicCatalog)

module.exports = router
