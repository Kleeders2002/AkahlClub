/**
 * 👑 ADMIN MIDDLEWARE - Compartido por VIP y CATÁLOGO
 * Middleware para verificar rol de administrador
 */

const { authMiddleware } = require('./auth');

/**
 * Middleware que requiere autenticación y rol ADMIN
 */
function adminMiddleware(req, res, next) {
  // Primero verificar autenticación
  authMiddleware(req, res, (err) => {
    if (err) return next(err);

    // Verificar rol ADMIN
    if (req.user && req.user.role === 'ADMIN') {
      next();
    } else {
      res.status(403).json({
        success: false,
        message: 'Acceso denegado. Se requiere rol de administrador'
      });
    }
  });
}

module.exports = {
  adminMiddleware
};
