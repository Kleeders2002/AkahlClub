/**
 * Pricing Controller
 * Lógica de negocio para precios - AKAHL Cotizador
 */

const Fabric = require('../models/Fabric');

// Configuración por defecto de multiplicadores
const DEFAULT_PRICING_CONFIG = {
  multipliers: {
    bespoke: {
      jacket: 8.5,
      trousers: 4.5,
      vest: 3.5,
      '2-piece-suit': 12.0,
      '3-piece-suit': 15.0,
      'dress-executive': 10.0,
    },
    industrial: {
      jacket: 5.5,
      trousers: 3.0,
      vest: 2.5,
      '2-piece-suit': 7.5,
      '3-piece-suit': 9.5,
      'dress-executive': 6.5,
    },
  },
  fabricMeters: {
    jacket: 2.5,
    trousers: 1.8,
    vest: 1.2,
    '2-piece-suit': 4.3,
    '3-piece-suit': 5.5,
    'dress-executive': 3.0,
  }
};

/**
 * Obtener configuración de precios
 * @route GET /api/pricing/config
 */
exports.getPricingConfig = async (req, res) => {
  try {
    // En una implementación real, esto vendría de una base de datos
    // Por ahora retornamos la configuración por defecto
    res.json({
      success: true,
      data: DEFAULT_PRICING_CONFIG
    });
  } catch (error) {
    console.error('Error fetching pricing config:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching pricing configuration'
    });
  }
};

/**
 * Actualizar multiplicadores de precio (ADMIN only)
 * @route PUT /api/pricing/multipliers
 */
exports.updateMultipliers = async (req, res) => {
  try {
    const { multipliers } = req.body;

    // Verificar que sea admin
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    // Validar estructura
    if (!multipliers || !multipliers.bespoke || !multipliers.industrial) {
      return res.status(400).json({
        success: false,
        message: 'Invalid multipliers structure'
      });
    }

    // Validar valores numéricos positivos
    const validateMultipliers = (obj) => {
      for (const key in obj) {
        if (typeof obj[key] !== 'number' || obj[key] < 0) {
          return false;
        }
      }
      return true;
    };

    if (!validateMultipliers(multipliers.bespoke) || !validateMultipliers(multipliers.industrial)) {
      return res.status(400).json({
        success: false,
        message: 'Multiplier values must be positive numbers'
      });
    }

    // En una implementación real, guardar en base de datos
    // Por ahora retornamos la configuración actualizada
    const updatedConfig = {
      ...DEFAULT_PRICING_CONFIG,
      multipliers
    };

    res.json({
      success: true,
      data: updatedConfig,
      message: 'Multipliers updated successfully'
    });
  } catch (error) {
    console.error('Error updating multipliers:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating multipliers'
    });
  }
};

/**
 * Calcular precio de una prenda
 * @route POST /api/pricing/calculate
 */
exports.calculatePrice = async (req, res) => {
  try {
    const { manufacturingType, garmentType, fabricId, fabricCode } = req.body;

    // Validar parámetros
    if (!manufacturingType || !garmentType) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: manufacturingType, garmentType'
      });
    }

    if (!fabricId && !fabricCode) {
      return res.status(400).json({
        success: false,
        message: 'Either fabricId or fabricCode is required'
      });
    }

    // Obtener la tela
    let fabric;
    if (fabricCode) {
      fabric = await Fabric.findByCode(fabricCode);
    } else {
      fabric = await Fabric.findById(fabricId);
    }

    if (!fabric) {
      return res.status(404).json({
        success: false,
        message: 'Fabric not found'
      });
    }

    // Verificar disponibilidad
    if (fabric.availability !== 'available') {
      return res.status(400).json({
        success: false,
        message: 'Fabric is out of stock'
      });
    }

    // Obtener configuración de precios
    const config = DEFAULT_PRICING_CONFIG;

    // Obtener multiplicador y metros
    const multiplier = config.multipliers[manufacturingType]?.[garmentType];
    const meters = config.fabricMeters[garmentType];

    if (!multiplier || !meters) {
      return res.status(400).json({
        success: false,
        message: `Invalid combination: ${manufacturingType} + ${garmentType}`
      });
    }

    // Calcular precio
    const fabricCost = fabric.basePricePerMeter * meters;
    const laborCost = fabric.basePricePerMeter * multiplier;
    const finalPrice = Math.round((fabricCost + laborCost) * 100) / 100;

    res.json({
      success: true,
      data: {
        finalPrice,
        fabric: {
          code: fabric.code,
          name: fabric.name,
          basePricePerMeter: fabric.basePricePerMeter
        },
        manufacturingType,
        garmentType,
        desglose: {
          fabricCost: Math.round(fabricCost * 100) / 100,
          laborCost: Math.round(laborCost * 100) / 100,
          multiplier,
          meters
        }
      }
    });
  } catch (error) {
    console.error('Error calculating price:', error);
    res.status(500).json({
      success: false,
      message: 'Error calculating price'
    });
  }
};
