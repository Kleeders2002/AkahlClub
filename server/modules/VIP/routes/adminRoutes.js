const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const adminMiddleware = require('../../../middleware/admin');

const prisma = new PrismaClient();

// Aplicar middleware de admin a todas las rutas
router.use(adminMiddleware);

// ============================================
// OBTENER TODO EL CONTENIDO (con filtros opcionales)
// ============================================
router.get('/contenido', async (req, res) => {
  try {
    const { idioma, tipo, premium } = req.query;

    const where = {};

    if (idioma) where.idioma = idioma;
    if (tipo) where.tipo = tipo;
    if (premium !== undefined) where.premium = premium === 'true';

    const contenido = await prisma.contenido.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: contenido,
      total: contenido.length
    });
  } catch (error) {
    console.error('Error al obtener contenido:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener contenido'
    });
  }
});

// ============================================
// OBTENER UN CONTENIDO POR ID
// ============================================
router.get('/contenido/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const contenido = await prisma.contenido.findUnique({
      where: { id }
    });

    if (!contenido) {
      return res.status(404).json({
        success: false,
        message: 'Contenido no encontrado'
      });
    }

    res.json({ success: true, data: contenido });
  } catch (error) {
    console.error('Error al obtener contenido:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener contenido'
    });
  }
});

// ============================================
// CREAR NUEVO CONTENIDO
// ============================================
router.post('/contenido', async (req, res) => {
  try {
    const {
      titulo,
      descripcion,
      tipo,
      url,
      premium = false,
      duracion,
      autor,
      paginas,
      categoria,
      thumbnailUrl,
      idioma = 'es'
    } = req.body;

    // Validaciones básicas
    if (!titulo || !descripcion || !tipo || !url) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos: titulo, descripcion, tipo, url'
      });
    }

    // Verificar que el tipo sea válido
    const tiposValidos = ['EBOOK', 'GUIA', 'VIDEO', 'TIP'];
    if (!tiposValidos.includes(tipo)) {
      return res.status(400).json({
        success: false,
        message: `Tipo debe ser uno de: ${tiposValidos.join(', ')}`
      });
    }

    // Verificar si ya existe contenido con ese título
    const existente = await prisma.contenido.findUnique({
      where: { titulo }
    });

    if (existente) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe contenido con ese título'
      });
    }

    const nuevoContenido = await prisma.contenido.create({
      data: {
        titulo,
        descripcion,
        tipo,
        url,
        premium: premium === true || premium === 'true',
        duracion: duracion || null,
        autor: autor || null,
        paginas: paginas ? parseInt(paginas) : null,
        categoria: categoria || null,
        thumbnailUrl: thumbnailUrl || null,
        idioma
      }
    });

    res.status(201).json({
      success: true,
      message: 'Contenido creado exitosamente',
      data: nuevoContenido
    });
  } catch (error) {
    console.error('Error al crear contenido:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear contenido'
    });
  }
});

// ============================================
// ACTUALIZAR CONTENIDO
// ============================================
router.put('/contenido/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      titulo,
      descripcion,
      tipo,
      url,
      premium,
      duracion,
      autor,
      paginas,
      categoria,
      thumbnailUrl,
      idioma
    } = req.body;

    // Verificar que el contenido existe
    const existente = await prisma.contenido.findUnique({
      where: { id }
    });

    if (!existente) {
      return res.status(404).json({
        success: false,
        message: 'Contenido no encontrado'
      });
    }

    // Si se cambia el título, verificar que no exista
    if (titulo && titulo !== existente.titulo) {
      const tituloExistente = await prisma.contenido.findUnique({
        where: { titulo }
      });

      if (tituloExistente) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe contenido con ese título'
        });
      }
    }

    const datosActualizados = {};
    if (titulo !== undefined) datosActualizados.titulo = titulo;
    if (descripcion !== undefined) datosActualizados.descripcion = descripcion;
    if (tipo !== undefined) datosActualizados.tipo = tipo;
    if (url !== undefined) datosActualizados.url = url;
    if (premium !== undefined) datosActualizados.premium = premium === true || premium === 'true';
    if (duracion !== undefined) datosActualizados.duracion = duracion;
    if (autor !== undefined) datosActualizados.autor = autor;
    if (paginas !== undefined) datosActualizados.paginas = paginas ? parseInt(paginas) : null;
    if (categoria !== undefined) datosActualizados.categoria = categoria;
    if (thumbnailUrl !== undefined) datosActualizados.thumbnailUrl = thumbnailUrl;
    if (idioma !== undefined) datosActualizados.idioma = idioma;

    const contenidoActualizado = await prisma.contenido.update({
      where: { id },
      data: datosActualizados
    });

    res.json({
      success: true,
      message: 'Contenido actualizado exitosamente',
      data: contenidoActualizado
    });
  } catch (error) {
    console.error('Error al actualizar contenido:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar contenido'
    });
  }
});

// ============================================
// ELIMINAR CONTENIDO
// ============================================
router.delete('/contenido/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el contenido existe
    const existente = await prisma.contenido.findUnique({
      where: { id }
    });

    if (!existente) {
      return res.status(404).json({
        success: false,
        message: 'Contenido no encontrado'
      });
    }

    await prisma.contenido.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Contenido eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar contenido:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar contenido'
    });
  }
});

// ============================================
// ESTADÍSTICAS RÁPIDAS
// ============================================
router.get('/stats', async (req, res) => {
  try {
    const [totalContenido, contenidoPorTipo, contenidoPremium] = await Promise.all([
      prisma.contenido.count(),
      prisma.contenido.groupBy({
        by: ['tipo'],
        _count: { tipo: true }
      }),
      prisma.contenido.groupBy({
        by: ['premium'],
        _count: { premium: true }
      })
    ]);

    const usuariosActivos = await prisma.usuario.count({
      where: { status: 'ACTIVE' }
    });

    res.json({
      success: true,
      data: {
        contenido: {
          total: totalContenido,
          porTipo: contenidoPorTipo.reduce((acc, item) => {
            acc[item.tipo] = item._count.tipo;
            return acc;
          }, {}),
          premium: contenidoPremium.find(p => p.premium)?._count.premium || 0,
          gratis: contenidoPremium.find(p => !p.premium)?._count.premium || 0
        },
        usuarios: {
          activos: usuariosActivos
        }
      }
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas'
    });
  }
});

module.exports = router;
