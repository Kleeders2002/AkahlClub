/**
 * Modelo de Fabric (Tela)
 * AKAHL Cotizador Backend
 */

const mongoose = require('mongoose');

const fabricSchema = new mongoose.Schema({
  // Código único de tela
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },

  // Nombre de la tela
  name: {
    type: String,
    required: true,
    trim: true
  },

  // Proveedor
  supplier: {
    type: String,
    required: true,
    trim: true
  },

  // Precio base por metro
  basePricePerMeter: {
    type: Number,
    required: true,
    min: 0
  },

  // Disponibilidad
  availability: {
    type: String,
    enum: ['available', 'out_of_stock'],
    default: 'available'
  },

  // Categoría
  category: {
    type: String,
    required: true,
    trim: true
  },

  // Peso
  weight: {
    type: String,
    trim: true
  },

  // Composición
  composition: {
    type: String,
    trim: true
  }

}, {
  timestamps: true // createdAt, updatedAt
});

// Índices para búsquedas rápidas
fabricSchema.index({ code: 1 });
fabricSchema.index({ availability: 1 });
fabricSchema.index({ category: 1 });
fabricSchema.index({ name: 'text', supplier: 'text', code: 'text' }); // Búsqueda de texto

// Método para buscar por código
fabricSchema.statics.findByCode = function(code) {
  return this.findOne({ code: code.toUpperCase() });
};

// Método para búsqueda general
fabricSchema.statics.search = function(query) {
  return this.find({
    $or: [
      { code: { $regex: query, $options: 'i' } },
      { name: { $regex: query, $options: 'i' } },
      { supplier: { $regex: query, $options: 'i' } },
      { category: { $regex: query, $options: 'i' } }
    ]
  });
};

const Fabric = mongoose.model('Fabric', fabricSchema);

module.exports = Fabric;
