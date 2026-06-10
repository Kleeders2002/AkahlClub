// server/routes/auth.js
// Rutas de autenticación con soporte para contraseña temporal
const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../User.model');
const { generateToken, verifyToken, isStrongPassword } = require('../auth.middleware');

const router = express.Router();

/**
 * POST /api/auth/register
 * Registrar nuevo usuario con contraseña temporal
 */
router.post('/register', async (req, res) => {
  try {
    const { email, nombre, plan, phone, country, stylePreference } = req.body;

    // Verificar si usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'El email ya está registrado'
      });
    }

    // Generar contraseña temporal
    const tempPassword = User.generateTempPassword();
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Mapear plan Silver/Plata y Gold/Oro
    const mappedPlan = plan?.toUpperCase() === 'GOLD' ? 'ORO' :
                      plan?.toUpperCase() === 'SILVER' ? 'PLATA' : 'PLATA';

    // Crear usuario
    const user = await User.create({
      email,
      nombre,
      plan: mappedPlan,
      phone: phone || '',
      country: country || '',
      stylePreference: stylePreference || null,
      password: hashedPassword,
      isTemporaryPassword: true  // ← Marcar como temporal
    });

    // Generar token inicial
    const token = await generateToken(user);

    // Aquí iría el envío de email con contraseña temporal
    // await emailService.sendTempPassword(email, tempPassword, nombre);
    console.log(`📧 [MOCK] Enviando email a ${email} con contraseña: ${tempPassword}`);

    res.json({
      success: true,
      message: 'Registro exitoso. Revisa tu correo para obtener tu contraseña temporal.',
      // Solo para desarrollo - en producción NO enviar la contraseña en la respuesta
      dev_temp_password: process.env.NODE_ENV === 'development' ? tempPassword : undefined
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar usuario'
    });
  }
});

/**
 * POST /api/auth/login
 * Iniciar sesión
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Generar token (include must_change_pwd claim)
    const token = await generateToken(user);

    res.json({
      success: true,
      token,
      must_change_pwd: user.isTemporaryPassword,  // ← Frontend lo lee
      message: user.isTemporaryPassword
        ? 'Debes cambiar tu contraseña temporal'
        : 'Login exitoso'
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión'
    });
  }
});

/**
 * POST /api/auth/change-password
 * Cambiar contraseña temporal por nueva
 */
router.post('/change-password', verifyToken, async (req, res) => {
  try {
    const { newPassword } = req.body;
    const userId = req.user.sub;

    // Validar fortaleza de contraseña
    if (!isStrongPassword(newPassword)) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener mínimo 8 caracteres, mayúscula, minúscula, número y carácter especial (@$!%*?&)'
      });
    }

    // Obtener usuario
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Verificar que no sea igual a la actual
    const samePassword = await bcrypt.compare(newPassword, user.password);
    if (samePassword) {
      return res.status(400).json({
        success: false,
        message: 'La nueva contraseña debe ser diferente a la actual'
      });
    }

    // Hashear nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar usuario
    user.password = hashedPassword;
    user.isTemporaryPassword = false;  // ← Ya no es temporal
    await user.save();

    // Generar NUEVO token sin must_change_pwd
    const newToken = await generateToken(user);

    res.json({
      success: true,
      token: newToken,
      message: 'Contraseña actualizada exitosamente'
    });

  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cambiar contraseña'
    });
  }
});

/**
 * POST /api/auth/logout
 * Cerrar sesión
 */
router.post('/logout', verifyToken, async (req, res) => {
  // Si usas token blacklist, agregar aquí
  res.json({
    success: true,
    message: 'Sesión cerrada'
  });
});

/**
 * GET /api/user/me
 * Obtener información del usuario actual
 */
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.sub).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      data: {
        id: user._id,
        email: user.email,
        nombre: user.nombre,
        plan: user.plan,
        phone: user.phone,
        country: user.country,
        stylePreference: user.stylePreference,
        must_change_pwd: user.isTemporaryPassword
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuario'
    });
  }
});

module.exports = router;
