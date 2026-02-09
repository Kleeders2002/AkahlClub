const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { 
  enviarEmailBienvenidaGratis, 
  enviarEmailPagoPendiente,
  enviarEmailPagoConfirmado 
} = require("../services/emailService");

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// POST /api/auth/register
router.post("/register", async (req, res) => {
  const { email, nombre, telefono, pais, estilo_preferencia, plan, comentarios, idioma } = req.body;

  console.log("📝 Intento de registro:", { email, nombre, plan, telefono, pais, idioma });

  if (!email || !nombre) {
    return res.status(400).json({
      success: false,
      message: "Email y nombre son obligatorios"
    });
  }

  try {
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email }
    });

    if (usuarioExistente) {
      return res.status(400).json({
        success: false,
        message: "Este email ya está registrado"
      });
    }

    const tempPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const planFinal = plan || 'PLATA';
    const idiomaUsuario = idioma || 'es'; // Default español

    // Separar nombre y apellido
    const nameParts = nombre.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Guardar metadata adicional
    const metadata = {
      comentarios: comentarios || '',
      telefono: telefono || '',
      fuenteRegistro: 'FORMULARIO_MEMBRESIA'
    };

    const nuevoUsuario = await prisma.usuario.create({
      data: {
        email,
        fullName: nombre,
        firstName: firstName,
        lastName: lastName,
        phone: telefono || null,
        country: pais || 'US',
        idioma: idiomaUsuario, // 🌍 Guardar idioma del usuario
        passwordHash: hashedPassword,
        tier: planFinal === 'PLATA' ? 'PLATA' : 'ORO',
        status: 'LEAD', // Todos los usuarios empiezan como LEAD (inactivo)
        source: 'FORM',
        stylePreference: estilo_preferencia === 'oldMoney' ? 'OLD_MONEY' :
                        estilo_preferencia === 'classic' ? 'CLASSIC' :
                        estilo_preferencia === 'modern' ? 'MODERN' : null,
        metadata: metadata
      }
    });

    console.log("✅ Usuario creado:", nuevoUsuario.id, "-", nuevoUsuario.email);
    console.log("📊 Estado inicial:", nuevoUsuario.status, "Tier:", nuevoUsuario.tier, "Idioma:", nuevoUsuario.idioma);

    // 📧 ENVIAR EMAIL SEGÚN EL PLAN EN EL IDIOMA DEL USUARIO
    let checkoutUrl;
    if (planFinal === 'ORO') {
      checkoutUrl = process.env.CHECKOUT_URL_ORO || `https://akahlstyle.systeme.io/0fee916e-ab00925a-b40f6434-9fbf5ad1`;
    } else {
      checkoutUrl = process.env.CHECKOUT_URL_PLATA || `https://akahlstyle.systeme.io/0fee916e-ab00925a-b40f6434-9fbf5ad1-7660c707`;
    }

    // Agregar email como parámetro si no está incluido
    if (!checkoutUrl.includes('email=')) {
      checkoutUrl += `?email=${encodeURIComponent(email)}`;
    }

    // Email de pago pendiente con el idioma correcto
    await enviarEmailPagoPendiente(email, nombre, tempPassword, checkoutUrl, idiomaUsuario);

    return res.json({
      success: true,
      message: planFinal === 'PLATA'
        ? (idiomaUsuario === 'en'
          ? "Registration successful! Check your email to complete payment and activate your account."
          : "¡Registro exitoso! Revisa tu email para completar el pago y activar tu cuenta.")
        : (idiomaUsuario === 'en'
          ? "Account created. Complete payment to activate your Gold membership."
          : "Cuenta creada. Completa el pago para activar tu membresía Gold."),
      requiresPayment: true,
      checkoutUrl: checkoutUrl,
      user: {
        id: nuevoUsuario.id,
        email: nuevoUsuario.email,
        nombre: nuevoUsuario.fullName,
        plan: nuevoUsuario.tier,
        idioma: nuevoUsuario.idioma
      }
    });

  } catch (err) {
    console.error("❌ Error en registro:", err);

    if (err.code === 'P2002') {
      return res.status(400).json({
        success: false,
        message: "Este email ya está registrado"
      });
    }

    res.status(500).json({
      success: false,
      message: "Error del servidor al crear usuario"
    });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("📧 Intento de login para:", email);

  if (!email || !password)
    return res.status(400).json({ success: false, message: "Email y contraseña requeridos" });

  try {
    console.log("🔍 Buscando usuario en DB...");

    const user = await prisma.usuario.findUnique({ where: { email } });
    console.log("👤 Usuario encontrado:", user ? "Sí" : "No");

    if (!user) return res.status(404).json({ success: false, message: "Usuario no encontrado" });

    // Debug: imprimir todos los campos del usuario
    console.log("📊 Datos del usuario:");
    console.log("  - email:", user.email);
    console.log("  - status:", user.status);
    console.log("  - tier:", user.tier);
    console.log("  - status !== 'ACTIVE':", user.status !== 'ACTIVE');
    console.log("  - status === 'ACTIVE':", user.status === 'ACTIVE');

    // Verificar si el usuario está activo - usando el campo correcto según schema Prisma
    if (user.status !== 'ACTIVE') {
      // Generar URL de checkout según su plan
      let checkoutUrl;
      if (user.tier === 'ORO') {
        checkoutUrl = process.env.CHECKOUT_URL_ORO || `https://akahlstyle.systeme.io/0fee916e-ab00925a-b40f6434-9fbf5ad1`;
      } else if (user.tier === 'PLATA') {
        checkoutUrl = process.env.CHECKOUT_URL_PLATA || `https://akahlstyle.systeme.io/0fee916e-ab00925a-b40f6434-9fbf5ad1-7660c707`;
      } else {
        checkoutUrl = null;
      }

      // Agregar email si no está incluido
      if (checkoutUrl && !checkoutUrl.includes('email=')) {
        checkoutUrl += `?email=${encodeURIComponent(user.email)}`;
      }

      return res.status(403).json({
        success: false,
        message: "Tu membresía está pendiente de pago",
        needsPayment: true,
        checkoutUrl: checkoutUrl
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    console.log("🔐 Contraseña coincide:", isMatch);

    if (!isMatch) return res.status(401).json({ success: false, message: "Contraseña incorrecta" });

    // Crear token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, plan: user.tier, nombre: user.fullName },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("✅ Login exitoso, token generado");

    res.json({
      success: true,
      message: "Login exitoso",
      token,
      user: {
        id: user.id,
        email: user.email,
        nombre: user.fullName,
        plan: user.tier,
      },
    });
  } catch (err) {
    console.error("❌ Error en login:", err);
    res.status(500).json({ success: false, message: "Error del servidor", error: err.message });
  }
});

// POST /api/auth/logout
router.post("/logout", authMiddleware, async (req, res) => {
  try {
    console.log("🚪 Usuario cerrando sesión:", req.user.email);
    
    res.json({
      success: true,
      message: "Sesión cerrada exitosamente"
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error al cerrar sesión" });
  }
});

// GET /api/auth/verify
router.get("/verify", authMiddleware, async (req, res) => {
  try {
    const user = await prisma.usuario.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        fullName: true,
        tier: true,
        status: true,
        firstName: true,
        lastName: true,
        phone: true,
        country: true,
        stylePreference: true
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado"
      });
    }

    if (user.status !== 'ACTIVE') {
      return res.status(403).json({
        success: false,
        message: "Usuario inactivo. Por favor completa el pago para activar tu cuenta.",
        needsPayment: true
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error al verificar usuario" });
  }
});

// POST /api/auth/change-password
router.post("/change-password", authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    console.log("🔐 Usuario intentando cambiar contraseña:", userId);

    // Validaciones
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "La contraseña actual y la nueva son requeridas"
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "La nueva contraseña debe tener al menos 8 caracteres"
      });
    }

    // Buscar usuario
    const user = await prisma.usuario.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado"
      });
    }

    // Verificar contraseña actual
    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "La contraseña actual es incorrecta"
      });
    }

    // Hashear nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar contraseña
    await prisma.usuario.update({
      where: { id: userId },
      data: { passwordHash: hashedPassword }
    });

    console.log("✅ Contraseña actualizada exitosamente para:", user.email);

    res.json({
      success: true,
      message: "Contraseña actualizada exitosamente"
    });

  } catch (err) {
    console.error("❌ Error al cambiar contraseña:", err);
    res.status(500).json({
      success: false,
      message: "Error del servidor al cambiar contraseña"
    });
  }
});

// Middleware para proteger rutas
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ success: false, message: "No token proporcionado" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Token inválido o expirado" });
  }
}

// POST /api/auth/activate-user - Endpoint para activar usuarios después del pago
router.post("/activate-user", async (req, res) => {
  const { email, tier } = req.body;

  console.log("🔄 Intento de activación:", { email, tier });

  if (!email || !tier) {
    return res.status(400).json({
      success: false,
      message: "Email y tier son requeridos"
    });
  }

  try {
    // Buscar usuario por email
    const usuario = await prisma.usuario.findUnique({
      where: { email }
    });

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado"
      });
    }

    // Actualizar usuario a ACTIVE
    const usuarioActualizado = await prisma.usuario.update({
      where: { email },
      data: {
        status: 'ACTIVE',
        tier: tier.toUpperCase()
      }
    });

    console.log("✅ Usuario activado:", usuarioActualizado.id, "-", usuarioActualizado.email);
    console.log("📊 Nuevo estado:", usuarioActualizado.status, "Tier:", usuarioActualizado.tier, "Idioma:", usuarioActualizado.idioma);

    // Enviar email de confirmación de pago en el idioma del usuario
    await enviarEmailPagoConfirmado(
      email,
      usuarioActualizado.fullName || email,
      usuarioActualizado.idioma || 'es'
    );

    res.json({
      success: true,
      message: "Usuario activado exitosamente",
      user: {
        id: usuarioActualizado.id,
        email: usuarioActualizado.email,
        status: usuarioActualizado.status,
        tier: usuarioActualizado.tier,
        idioma: usuarioActualizado.idioma
      }
    });

  } catch (err) {
    console.error("❌ Error al activar usuario:", err);
    res.status(500).json({
      success: false,
      message: "Error del servidor al activar usuario"
    });
  }
});

module.exports = { router, authMiddleware };