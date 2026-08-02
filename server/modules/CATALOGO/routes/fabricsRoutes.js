/**
 * 🧵 FABRICS ROUTES - CATÁLOGO (AKAHL ATELIER)
 * Rutas de telas para el sistema de cotización
 *
 * Este módulo es exclusivo del CATÁLOGO
 */

const express = require('express');
const fabricController = require('../controllers/fabricController');
const { authMiddleware, adminMiddleware } = require('../../../middleware/auth');
const { adminMiddleware: _adminMiddleware } = require('../../../middleware/admin');

const router = express.Router();

/**
 * @route   GET /api/catalogo/fabrics
 * @desc    Obtener todas las telas
 * @access  Público (CATÁLOGO usa PIN local)
 */
router.get('/', fabricController.getAllFabrics);

/**
 * @route   GET /api/catalogo/fabrics/code/:code
 * @desc    Buscar tela por código
 * @access  Público (CATÁLOGO usa PIN local)
 */
router.get('/code/:code', fabricController.getFabricByCode);

/**
 * @route   GET /api/catalogo/fabrics/search
 * @desc    Buscar telas por texto
 * @access  Público (CATÁLOGO usa PIN local)
 */
router.get('/search', fabricController.searchFabrics);

/**
 * @route   POST /api/catalogo/fabrics
 * @desc    Crear nueva tela
 * @access  Admin only
 */
router.post('/', authMiddleware, _adminMiddleware, fabricController.createFabric);

/**
 * @route   PUT /api/catalogo/fabrics/:id
 * @desc    Actualizar tela
 * @access  Admin only
 */
router.put('/:id', authMiddleware, _adminMiddleware, fabricController.updateFabric);

/**
 * @route   PATCH /api/catalogo/fabrics/:id/availability
 * @desc    Cambiar disponibilidad de tela
 * @access  Admin only
 */
router.patch('/:id/availability', authMiddleware, _adminMiddleware, fabricController.updateAvailability);

/**
 * @route   DELETE /api/catalogo/fabrics/:id
 * @desc    Eliminar tela
 * @access  Admin only
 */
router.delete('/:id', authMiddleware, _adminMiddleware, fabricController.deleteFabric);

module.exports = router;
