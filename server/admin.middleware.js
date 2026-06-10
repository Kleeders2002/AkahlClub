/**
 * Middleware para verificar si el usuario tiene rol ADMIN
 */
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'akahlclub-secret-key-2024';

function adminMiddleware(req, res, next) {
  try {
    // Verificar token
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado'
      });
    }

    const token = authHeader.substring(7);

    // Verificar y decodificar token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Verificar si tiene rol ADMIN
    if (decoded.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado. Se requiere rol de administrador'
      });
    }

    // Agregar info del usuario al request
    req.admin = {
      id: decoded.id,
      email: decoded.email,
      nombre: decoded.nombre,
      role: decoded.role
    };

    next();
  } catch (error) {
    console.error('Error en admin middleware:', error);
    return res.status(401).json({
      success: false,
      message: 'Token inválido o expirado'
    });
  }
}

module.exports = adminMiddleware;
