// server/middleware/auth.js
// Middleware de autenticación con soporte para contraseña temporal
const jwt = require('jsonwebtoken');
const User = require('../User.model');

/**
 * Generar token JWT con claims de usuario
 * @param {Object} user - Usuario de MongoDB
 * @returns {Promise<string>} Token JWT
 */
async function generateToken(user) {
  const payload = {
    sub: user._id.toString(),
    email: user.email,
    nombre: user.nombre,
    plan: user.plan,
    must_change_pwd: user.isTemporaryPassword  // ← Claim directo
  };

  return jwt.sign(payload, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '7d'
  });
}

/**
 * Verificar token y detectar contraseña temporal
 * Middleware para Express
 */
async function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    // Verificar si tiene contraseña temporal
    if (decoded.must_change_pwd) {
      // Rutas permitidas con contraseña temporal
      const allowedRoutes = [
        '/api/auth/change-password',
        '/api/auth/logout',
        '/api/user/me',
        '/api/contenido'  // Permitir ver contenido (pero no descargar)
      ];

      const isAllowed = allowedRoutes.some(route =>
        req.path.startsWith(route)
      );

      if (!isAllowed) {
        return res.status(403).json({
          success: false,
          must_change_pwd: true,
          message: 'Debes cambiar tu contraseña temporal para continuar'
        });
      }
    }

    // Adjuntar usuario al request
    req.user = decoded;
    next();

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado'
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }
}

/**
 * Verificador de fortaleza de contraseña
 * @param {string} password
 * @returns {boolean}
 */
function isStrongPassword(password) {
  // Mínimo 8 caracteres
  if (password.length < 8) return false;

  // Al menos una mayúscula
  if (!/[A-Z]/.test(password)) return false;

  // Al menos una minúscula
  if (!/[a-z]/.test(password)) return false;

  // Al menos un número
  if (!/[0-9]/.test(password)) return false;

  // Al menos un carácter especial
  if (!/[@$!%*?&]/.test(password)) return false;

  return true;
}

module.exports = {
  generateToken,
  verifyToken,
  isStrongPassword
};
