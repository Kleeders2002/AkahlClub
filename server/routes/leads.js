const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const { z } = require("zod");
const { enviarEmailBienvenidaGratis } = require('../services/emailService');

// ✅ Singleton de Prisma (reutilizable)
const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

// Validación - AGREGADO language
const LeadSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  name: z.string().min(2, { message: "Nombre muy corto" }).max(100),
  phone: z.string().optional(),
  language: z.enum(['en', 'es']).optional().default('es'),
});

// Función auxiliar para sanitizar usuario
function sanitizeUser(user) {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

// POST /api/leads
router.post("/", async (req, res) => {
  try {
    console.log("📝 Recibiendo lead:", req.body);
    
    const validatedData = LeadSchema.parse(req.body);
    
    // Verificar si existe
    const existingUser = await prisma.usuario.findUnique({
      where: { email: validatedData.email }
    });
    
    if (existingUser) {
      console.log("⚠️ Lead ya existe:", validatedData.email);
      
      // Mensajes traducidos para email ya registrado
      const messages = {
        en: {
          message: "This email is already part of our VIP circle!",
          note: "You're already receiving exclusive updates and benefits."
        },
        es: {
          message: "¡Este correo ya forma parte de nuestro círculo VIP!",
          note: "Ya estás recibiendo actualizaciones y beneficios exclusivos."
        }
      };
      
      const lang = validatedData.language || 'es';
      
      // Retornar error 409 (Conflict) para indicar duplicado
      return res.status(409).json({
        success: false,
        user: sanitizeUser(existingUser),
        message: messages[lang].message,
        note: messages[lang].note,
        alreadyExists: true
      });
    }
    
    // Crear lead
    const newLead = await prisma.usuario.create({
      data: {
        email: validatedData.email,
        fullName: validatedData.name,
        phone: validatedData.phone || null,
        status: "LEAD",
        tier: "POTENCIAL",
        source: "MODAL",
        country: "US",
        metadata: JSON.stringify({
          registeredAt: new Date().toISOString(),
          userAgent: req.headers["user-agent"] || "unknown",
          sourcePage: req.headers.referer || "direct",
          language: validatedData.language
        })
      }
    });
    
    console.log("✅ Lead creado:", newLead.email);
    
    // Enviar email de bienvenida
    try {
      await enviarEmailBienvenidaGratis(
        newLead.email,
        newLead.fullName,
        null, // password (no aplica para leads)
        validatedData.language
      );
      console.log("📧 Email de bienvenida enviado a:", newLead.email);
    } catch (emailError) {
      console.error("⚠️ Error enviando email (lead creado correctamente):", emailError);
      // No fallar la petición si el email falla
    }
    
    // Mensajes de éxito traducidos
    const successMessages = {
      en: {
        message: "Welcome to the AKAHL VIP Circle!",
        benefits: [
          "Early access to new launches",
          "Exclusive monthly content",
          "VIP discounts for members"
        ],
        nextStep: "Check your email for a personalized welcome message"
      },
      es: {
        message: "¡Bienvenido al Círculo VIP de AKAHL!",
        benefits: [
          "Acceso anticipado a lanzamientos",
          "Contenido exclusivo mensual",
          "Descuentos VIP para miembros"
        ],
        nextStep: "Revisa tu correo para un mensaje de bienvenida personalizado"
      }
    };
    
    const lang = validatedData.language || 'es';
    
    res.status(201).json({
      success: true,
      user: sanitizeUser(newLead),
      message: successMessages[lang].message,
      benefits: successMessages[lang].benefits,
      nextStep: successMessages[lang].nextStep
    });
    
  } catch (error) {
    console.error("❌ Error completo:", error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: "Por favor, verifica tus datos",
        details: error.errors.map(e => ({
          field: e.path[0],
          message: e.message
        }))
      });
    }
    
    res.status(500).json({
      success: false,
      error: "Error en nuestro sistema. Por favor, intenta de nuevo.",
      referenceId: `lead_${Date.now()}`,
      ...(process.env.NODE_ENV === 'development' && { 
        debug: error.message 
      })
    });
  }
});

module.exports = router;