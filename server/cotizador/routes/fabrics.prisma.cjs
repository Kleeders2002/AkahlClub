/**
 * Fabric Routes - PRISMA VERSION (CommonJS)
 * Rutas de telas - AKAHL Cotizador API
 *
 * Migrado a Prisma + PostgreSQL
 */

const express = require('express')
const fabricController = require('../controllers/fabricController.prisma.cjs')

const router = express.Router()

/**
 * Middleware de autenticación
 * Usa el middleware del servidor principal si está disponible
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied' })
  }

  try {
    const jwt = require('jsonwebtoken')
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
    req.user = decoded
    next()
  } catch (error) {
    res.status(403).json({ success: false, message: 'Invalid token' })
  }
}

/**
 * @route   GET /api/fabrics
 * @desc    Obtener todas las telas
 * @access  Private (requiere token)
 */
router.get('/', authenticateToken, fabricController.getAllFabrics)

/**
 * @route   GET /api/fabrics/code/:code
 * @desc    Buscar tela por código
 * @access  Private (requiere token)
 */
router.get('/code/:code', authenticateToken, fabricController.getFabricByCode)

/**
 * @route   GET /api/fabrics/search
 * @desc    Buscar telas por texto
 * @access  Private (requiere token)
 */
router.get('/search', authenticateToken, fabricController.searchFabrics)

/**
 * @route   POST /api/fabrics
 * @desc    Crear nueva tela
 * @access  Admin only
 */
router.post('/', authenticateToken, fabricController.createFabric)

/**
 * @route   PUT /api/fabrics/:id
 * @desc    Actualizar tela
 * @access  Admin only
 */
router.put('/:id', authenticateToken, fabricController.updateFabric)

/**
 * @route   PATCH /api/fabrics/:id/availability
 * @desc    Cambiar disponibilidad de tela
 * @access  Admin only
 */
router.patch('/:id/availability', authenticateToken, fabricController.updateAvailability)

/**
 * @route   DELETE /api/fabrics/:id
 * @desc    Eliminar tela
 * @access  Admin only
 */
router.delete('/:id', authenticateToken, fabricController.deleteFabric)

module.exports = router
