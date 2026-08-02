/**
 * 🔐 AUTH MIDDLEWARE - Compartido por VIP y CATÁLOGO
 * Middleware de autenticación JWT para todo el servidor
 */

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

/**
 * Middleware de autenticación JWT
 * Verifica el token y adjunta el usuario decodificado a req.user
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'No token proporcionado'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Verificar si el usuario debe cambiar contraseña temporal
    if (decoded.must_change_pwd) {
      const allowedRoutes = [
        '/api/auth/change-password',
        '/api/auth/update-password',
        '/api/auth/logout',
        '/api/auth/verify'
      ];

      const isAllowed = allowedRoutes.some(route =>
        req.originalUrl.startsWith(route)
      );

      if (!isAllowed) {
        return res.status(403).json({
          success: false,
          must_change_pwd: true,
          message: 'Debes cambiar tu contraseña temporal para continuar'
        });
      }
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Token inválido o expirado'
    });
  }
}

/**
 * Middleware para verificar token sin bloquear
 * Similar a authMiddleware pero no falla si no hay token
 */
function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    req.user = null;
    return next();
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    req.user = null;
  }

  next();
}

module.exports = {
  authMiddleware,
  optionalAuth,
  JWT_SECRET
};
