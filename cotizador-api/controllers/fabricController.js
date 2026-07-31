/**
 * Fabric Controller
 * Lógica de negocio para telas - AKAHL Cotizador
 */

const Fabric = require('../models/Fabric');

/**
 * Obtener todas las telas
 * @route GET /api/fabrics
 */
exports.getAllFabrics = async (req, res) => {
  try {
    const fabrics = await Fabric.find().sort({ code: 1 });
    res.json({
      success: true,
      count: fabrics.length,
      data: fabrics
    });
  } catch (error) {
    console.error('Error fetching fabrics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching fabrics'
    });
  }
};

/**
 * Buscar tela por código
 * @route GET /api/fabrics/code/:code
 */
exports.getFabricByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const fabric = await Fabric.findByCode(code);

    if (!fabric) {
      return res.status(404).json({
        success: false,
        message: 'Fabric not found'
      });
    }

    res.json({
      success: true,
      data: fabric
    });
  } catch (error) {
    console.error('Error fetching fabric by code:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching fabric'
    });
  }
};

/**
 * Buscar telas por texto
 * @route GET /api/fabrics?q=query
 */
exports.searchFabrics = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return exports.getAllFabrics(req, res);
    }

    const fabrics = await Fabric.search(q).sort({ code: 1 });

    res.json({
      success: true,
      count: fabrics.length,
      data: fabrics
    });
  } catch (error) {
    console.error('Error searching fabrics:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching fabrics'
    });
  }
};

/**
 * Actualizar tela (ADMIN only)
 * @route PUT /api/fabrics/:id
 */
exports.updateFabric = async (req, res) => {
  try {
    const { id } = req.params;
    const { basePricePerMeter, availability, name, supplier, category, weight, composition } = req.body;

    // Verificar que sea admin
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const updateData = {};
    if (basePricePerMeter !== undefined) updateData.basePricePerMeter = basePricePerMeter;
    if (availability !== undefined) updateData.availability = availability;
    if (name !== undefined) updateData.name = name;
    if (supplier !== undefined) updateData.supplier = supplier;
    if (category !== undefined) updateData.category = category;
    if (weight !== undefined) updateData.weight = weight;
    if (composition !== undefined) updateData.composition = composition;

    const fabric = await Fabric.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!fabric) {
      return res.status(404).json({
        success: false,
        message: 'Fabric not found'
      });
    }

    res.json({
      success: true,
      data: fabric
    });
  } catch (error) {
    console.error('Error updating fabric:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating fabric'
    });
  }
};

/**
 * Cambiar disponibilidad de tela (ADMIN only)
 * @route PATCH /api/fabrics/:id/availability
 */
exports.toggleAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { availability } = req.body;

    // Verificar que sea admin
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    if (!availability || !['available', 'out_of_stock'].includes(availability)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid availability value'
      });
    }

    const fabric = await Fabric.findByIdAndUpdate(
      id,
      { availability },
      { new: true }
    );

    if (!fabric) {
      return res.status(404).json({
        success: false,
        message: 'Fabric not found'
      });
    }

    res.json({
      success: true,
      data: fabric
    });
  } catch (error) {
    console.error('Error toggling availability:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating availability'
    });
  }
};

/**
 * Crear nueva tela (ADMIN only - opcional)
 * @route POST /api/fabrics
 */
exports.createFabric = async (req, res) => {
  try {
    // Verificar que sea admin
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const { code, name, supplier, basePricePerMeter, category, weight, composition } = req.body;

    // Verificar que el código no exista
    const existing = await Fabric.findByCode(code);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Fabric code already exists'
      });
    }

    const fabric = await Fabric.create({
      code: code.toUpperCase(),
      name,
      supplier,
      basePricePerMeter,
      category,
      weight,
      composition,
      availability: 'available'
    });

    res.status(201).json({
      success: true,
      data: fabric
    });
  } catch (error) {
    console.error('Error creating fabric:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating fabric'
    });
  }
};

/**
 * Eliminar tela (ADMIN only - opcional)
 * @route DELETE /api/fabrics/:id
 */
exports.deleteFabric = async (req, res) => {
  try {
    // Verificar que sea admin
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const fabric = await Fabric.findByIdAndDelete(req.params.id);

    if (!fabric) {
      return res.status(404).json({
        success: false,
        message: 'Fabric not found'
      });
    }

    res.json({
      success: true,
      message: 'Fabric deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting fabric:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting fabric'
    });
  }
};
