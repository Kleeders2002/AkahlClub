/**
 * 📋 CONFIGURACIÓN DE PINS - CATÁLOGO (AKAHL ATELIER)
 * Sistema de autenticación por PIN para el cotizador
 *
 * Estos PINs son usados localmente en el frontend del Catálogo
 * y también se validan en el backend para generar JWT temporales
 */

/**
 * Configuración de PINs del Catálogo AKAHL Atelier
 * Cada PIN tiene un rol, nombre y permisos asociados
 */
const PIN_CONFIG = {
  // PIN de Usuario - Acceso básico a cotizaciones
  '1234': {
    role: 'USER',
    name: 'Asociado',
    permissions: ['quotations']
  },

  // PIN de Administrador - Acceso completo
  '9999': {
    role: 'ADMIN',
    name: 'Administrador',
    permissions: ['quotations', 'admin']
  }
};

/**
 * Valida un PIN y retorna su configuración
 * @param {string} pin - PIN de 4 dígitos
 * @returns {object|null} Configuración del PIN o null si es inválido
 */
function validatePin(pin) {
  if (!pin || typeof pin !== 'string') {
    return null;
  }

  // Validar formato de 4 dígitos
  if (!/^\d{4}$/.test(pin)) {
    return null;
  }

  return PIN_CONFIG[pin] || null;
}

/**
 * Obtiene todos los PINs configurados
 * @returns {object} Objeto con todos los PINs
 */
function getAllPins() {
  return { ...PIN_CONFIG };
}

module.exports = {
  PIN_CONFIG,
  validatePin,
  getAllPins
};
