// routes/members.js
import express from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = express.Router();
const prisma = new PrismaClient();

// Esquema de validación para miembros
const MemberSchema = z.object({
  // Información personal
  email: z.string().email({ message: 'Email inválido' }),
  firstName: z.string().min(2, { message: 'Nombre mínimo 2 caracteres' }),
  lastName: z.string().min(2, { message: 'Apellido mínimo 2 caracteres' }),
  phone: z.string().min(10, { message: 'Teléfono inválido' }),
  country: z.string().length(2, { message: 'Código país inválido' }),
  countryCode: z.string().optional(),
  
  // Preferencias
  stylePreference: z.enum(['OLD_MONEY', 'CLASSIC', 'MODERN']).optional(),
  membershipPlan: z.enum(['PLATA', 'ORO']).default('PLATA'),
  
  // Seguridad y términos
  password: z.string()
    .min(8, { message: 'Contraseña mínimo 8 caracteres' }),
  
  confirmPassword: z.string(),
  acceptedTerms: z.boolean().refine(val => val === true, {
    message: 'Debes aceptar los términos y condiciones'
  }),
  
  // Opcionales
  comments: z.string().max(500).optional(),
  
}).refine(data => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword']
});

// POST /api/members - Crear miembro desde formulario
router.post('/', async (req, res) => {
  try {
    console.log('👤 Registrando miembro:', req.body.email);
    
    // Validar datos
    const validatedData = MemberSchema.parse(req.body);
    
    // Verificar si el usuario ya existe
    const existingUser = await prisma.usuario.findUnique({
      where: { email: validatedData.email }
    });
    
    let userToReturn;
    let isUpgrade = false;
    
    if (existingUser) {
      // Si es un LEAD, actualizarlo a miembro
      if (existingUser.status === 'LEAD') {
        console.log('🔄 Actualizando lead a miembro:', existingUser.email);
        userToReturn = await upgradeLeadToMember(existingUser, validatedData);
        isUpgrade = true;
      } else {
        return res.status(400).json({
          success: false,
          error: 'Este email ya está registrado',
          suggestion: '¿Olvidaste tu contraseña? Contáctanos.'
        });
      }
    } else {
      // Hash de la contraseña
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);
      
      // Crear nuevo usuario
      userToReturn = await prisma.usuario.create({
        data: {
          email: validatedData.email,
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
          phone: `${validatedData.countryCode || ''}${validatedData.phone}`.trim(),
          country: validatedData.country,
          stylePreference: validatedData.stylePreference,
          passwordHash: hashedPassword,
          status: 'ACTIVE', // Asumimos que paga en systeme.io
          tier: validatedData.membershipPlan,
          source: 'FORM',
          metadata: {
            registrationDate: new Date().toISOString(),
            comments: validatedData.comments,
            registrationSource: 'membership_form',
            userAgent: req.headers['user-agent']
          }
        }
      });
      
      console.log('✅ Miembro creado:', userToReturn.email);
    }
    
    // Preparar respuesta
    const response = {
      success: true,
      user: sanitizeUser(userToReturn),
      message: isUpgrade 
        ? '¡Cuenta actualizada exitosamente!' 
        : '¡Bienvenido a AKAHL CLUB! Tu registro está completo.',
      membership: {
        plan: validatedData.membershipPlan,
        status: 'active',
        features: getPlanFeatures(validatedData.membershipPlan)
      },
      nextSteps: [
        'Revisa tu email para confirmar tu cuenta',
        'Accede a tu área de miembro',
        'Explora el contenido exclusivo'
      ]
    };
    
    // Si el plan requiere pago en systeme.io, agregamos la URL
    if (['PLATA', 'ORO'].includes(validatedData.membershipPlan)) {
      response.paymentRequired = true;
      response.paymentRedirect = getSystemeIoUrl(validatedData.membershipPlan, userToReturn);
      response.instructions = 'Serás redirigido a systeme.io para completar el pago';
    }
    
    res.status(201).json(response);
    
  } catch (error) {
    console.error('❌ Error registrando miembro:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Error de validación',
        details: error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        }))
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor. Por favor, intenta más tarde.',
      referenceId: `member_${Date.now()}`
    });
  }
});

// GET /api/members/:email - Verificar si email existe
router.get('/check/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    const user = await prisma.usuario.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        status: true,
        tier: true,
        createdAt: true
      }
    });
    
    res.json({
      success: true,
      exists: !!user,
      user: user || null
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error interno' });
  }
});

// Helper: Actualizar lead a miembro
async function upgradeLeadToMember(lead, memberData) {
  const hashedPassword = await bcrypt.hash(memberData.password, 10);
  
  return await prisma.usuario.update({
    where: { id: lead.id },
    data: {
      firstName: memberData.firstName,
      lastName: memberData.lastName,
      phone: `${memberData.countryCode || ''}${memberData.phone}`.trim(),
      country: memberData.country,
      stylePreference: memberData.stylePreference,
      passwordHash: hashedPassword,
      tier: memberData.membershipPlan,
      status: 'ACTIVE',
      source: 'FORM',
      metadata: {
        ...(lead.metadata || {}),
        upgradedFromLead: true,
        upgradeDate: new Date().toISOString(),
        comments: memberData.comments
      }
    }
  });
}

// Helper: Obtener URL de systeme.io según plan
function getSystemeIoUrl(plan, user) {
  // Configura estas URLs en tu .env
  const urls = {
    PLATA: process.env.SYSTEME_IO_PLATA_URL,
    ORO: process.env.SYSTEME_IO_ORO_URL
  };
  
  let url = urls[plan] || process.env.SYSTEME_IO_DEFAULT_URL;
  
  // Agregar parámetros de tracking si la URL lo permite
  if (url && user) {
    const params = new URLSearchParams({
      email: user.email,
      name: `${user.firstName} ${user.lastName}`.trim(),
      plan: plan.toLowerCase(),
      ref: 'akahl_portal'
    });
    
    url = `${url}${url.includes('?') ? '&' : '?'}${params.toString()}`;
  }
  
  return url;
}

// Helper: Obtener características del plan
function getPlanFeatures(plan) {
  const features = {
    PLATA: [
      'Acceso a contenido básico exclusivo',
      'Newsletter mensual VIP',
      'Descuentos del 15% en compras',
      'Acceso anticipado a lanzamientos'
    ],
    ORO: [
      'TODO el contenido premium',
      'Asesoría de estilo personalizada',
      'Descuentos del 30% en compras',
      'Acceso a eventos exclusivos',
      'Envío prioritario gratis',
      'Soporte VIP 24/7'
    ]
  };
  
  return features[plan] || features.PLATA;
}

// Helper para ocultar datos sensibles
function sanitizeUser(user) {
  const { passwordHash, metadata, ...safeUser } = user;
  return {
    ...safeUser,
    hasPassword: !!passwordHash
  };
}

export default router;