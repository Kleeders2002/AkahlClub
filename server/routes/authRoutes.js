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
  const { email, nombre, telefono, plan, comentarios } = req.body;
  
  console.log("📝 Intento de registro:", { email, nombre, plan });
  
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
    const estaActivo = planFinal === 'PLATA';
    
    const nuevoUsuario = await prisma.usuario.create({
      data: {
        email,
        nombre,
        password: hashedPassword,
        plan: planFinal,
        activo: estaActivo
      }
    });
    
    console.log("✅ Usuario creado:", nuevoUsuario.id, "-", nuevoUsuario.email);
    
    // 📧 ENVIAR EMAIL SEGÚN EL PLAN
    if (planFinal === 'PLATA') {
      // Email de bienvenida con acceso inmediato
      await enviarEmailBienvenidaGratis(email, nombre, tempPassword);
      
      return res.json({
        success: true,
        message: "¡Registro exitoso! Revisa tu email para acceder.",
        requiresPayment: false,
        user: {
          id: nuevoUsuario.id,
          email: nuevoUsuario.email,
          nombre: nuevoUsuario.nombre,
          plan: nuevoUsuario.plan
        }
      });
    }
    
    if (planFinal === 'ORO') {
      const checkoutUrl = process.env.CHECKOUT_URL_ORO || 
        `https://checkout.systeme.io/tu-producto-oro?email=${encodeURIComponent(email)}`;
      
      // Email de pago pendiente
      await enviarEmailPagoPendiente(email, nombre, tempPassword, checkoutUrl);
      
      return res.json({
        success: true,
        message: "Cuenta creada. Completa el pago para activar tu membresía.",
        requiresPayment: true,
        checkoutUrl: checkoutUrl,
        tempPassword: tempPassword,
        user: {
          id: nuevoUsuario.id,
          email: nuevoUsuario.email,
          nombre: nuevoUsuario.nombre,
          plan: nuevoUsuario.plan
        }
      });
    }
    
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
      const checkoutUrl = user.tier === 'ORO'
        ? `https://checkout.systeme.io/tu-producto-oro?email=${encodeURIComponent(user.email)}`
        : null;

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
      select: { id: true, email: true, nombre: true, plan: true, activo: true }
    });

    if (!user || !user.activo) {
      return res.status(403).json({
        success: false,
        message: "Usuario inactivo o no encontrado"
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

module.exports = { router, authMiddleware };