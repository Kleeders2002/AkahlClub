/**
 * Fabric Routes
 * Rutas de telas - AKAHL Cotizador API
 */

const express = require('express');
const router = express.Router();
const fabricController = require('../controllers/fabricController');

// Middleware de autenticación (debe existir en tu proyecto)
const authenticateToken = (req, res, next) => {
  // Extraer token del header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied' });
  }

  try {
    // Verificar token (ajusta según tu implementación JWT actual)
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ success: false, message: 'Invalid token' });
  }
};

/**
 * @route   GET /api/fabrics
 * @desc    Obtener todas las telas
 * @access  Private (requiere token)
 */
router.get('/', authenticateToken, fabricController.getAllFabrics);

/**
 * @route   GET /api/fabrics/code/:code
 * @desc    Buscar tela por código
 * @access  Private (requiere token)
 */
router.get('/code/:code', authenticateToken, fabricController.getFabricByCode);

/**
 * @route   GET /api/fabrics/search
 * @desc    Buscar telas por texto
 * @access  Private (requiere token)
 */
router.get('/search', authenticateToken, fabricController.searchFabrics);

/**
 * @route   POST /api/fabrics
 * @desc    Crear nueva tela
 * @access  Admin only
 */
router.post('/', authenticateToken, fabricController.createFabric);

/**
 * @route   PUT /api/fabrics/:id
 * @desc    Actualizar tela
 * @access  Admin only
 */
router.put('/:id', authenticateToken, fabricController.updateFabric);

/**
 * @route   PATCH /api/fabrics/:id/availability
 * @desc    Cambiar disponibilidad de tela
 * @access  Admin only
 */
router.patch('/:id/availability', authenticateToken, fabricController.toggleAvailability);

/**
 * @route   DELETE /api/fabrics/:id
 * @desc    Eliminar tela
 * @access  Admin only
 */
router.delete('/:id', authenticateToken, fabricController.deleteFabric);

module.exports = router;
