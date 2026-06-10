// server/models/User.js
// Modelo de Usuario con soporte para contraseña temporal
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  nombre: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    default: ''
  },
  country: {
    type: String,
    default: ''
  },
  plan: {
    type: String,
    enum: ['PLATA', 'SILVER', 'ORO', 'GOLD'],
    default: 'PLATA'
  },
  stylePreference: {
    type: String,
    enum: ['old_money', 'classic', 'modern'],
    default: null
  },

  // Campo único para contraseña temporal
  isTemporaryPassword: {
    type: Boolean,
    default: false
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Método estático para generar contraseña temporal aleatoria
userSchema.statics.generateTempPassword = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#$%&*';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// Método para verificar si la contraseña es fuerte
userSchema.statics.isStrongPassword = (password) => {
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
};

module.exports = mongoose.model('User', userSchema);
