/**
 * 🧵 FABRIC CONTROLLER - CATÁLOGO (AKAHL ATELIER)
 * Lógica de negocio para telas del sistema de cotización
 *
 * Este módulo es exclusivo del CATÁLOGO
 */

const { prisma } = require('../../../../config/database');

/**
 * Obtener todas las telas
 * @route GET /api/fabrics
 */
exports.getAllFabrics = async (req, res) => {
  try {
    const telas = await prisma.tela.findMany({
      orderBy: { codigo: 'asc' },
      include: {
        coleccion: {
          select: {
            nombre: true,
            proveedor: true
          }
        }
      }
    })

    res.json({
      success: true,
      count: telas.length,
      data: telas
    })
  } catch (error) {
    console.error('Error fetching fabrics:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching fabrics'
    })
  }
}

/**
 * Buscar tela por código
 * @route GET /api/fabrics/code/:code
 */
exports.getFabricByCode = async (req, res) => {
  try {
    const { code } = req.params

    const tela = await prisma.tela.findFirst({
      where: { codigo: code.toUpperCase() },
      include: {
        coleccion: true
      }
    })

    if (!tela) {
      return res.status(404).json({
        success: false,
        message: 'Fabric not found'
      })
    }

    res.json({
      success: true,
      data: tela
    })
  } catch (error) {
    console.error('Error fetching fabric by code:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching fabric'
    })
  }
}

/**
 * Buscar telas por texto
 * @route GET /api/fabrics/search?q=query
 */
exports.searchFabrics = async (req, res) => {
  try {
    const { q } = req.query

    if (!q) {
      return exports.getAllFabrics(req, res)
    }

    const searchTerm = `%${q}%`

    // Usamos $queryRaw para búsqueda tipo LIKE con múltiples campos
    const telas = await prisma.$queryRaw`
      SELECT
        t.*,
        c.nombre as "coleccion_nombre",
        c.proveedor as "coleccion_proveedor"
      FROM telas t
      LEFT JOIN colecciones c ON c.id_coleccion = t.id_coleccion
      WHERE
        t.codigo ILIKE ${searchTerm}
        OR t.color ILIKE ${searchTerm}
        OR c.nombre ILIKE ${searchTerm}
        OR c.proveedor ILIKE ${searchTerm}
      ORDER BY t.codigo ASC
    `

    res.json({
      success: true,
      count: telas.length,
      data: telas
    })
  } catch (error) {
    console.error('Error searching fabrics:', error)
    res.status(500).json({
      success: false,
      message: 'Error searching fabrics'
    })
  }
}

/**
 * Crear nueva tela (ADMIN only)
 * @route POST /api/fabrics
 */
exports.createFabric = async (req, res) => {
  try {
    const {
      id_coleccion,
      codigo,
      color,
      precio_por_yarda,
      descuento = 0,
      disponibilidad = 'disponible',
      visible_publico = true
    } = req.body

    // Validaciones
    if (!id_coleccion || !codigo || !precio_por_yarda) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: id_coleccion, codigo, precio_por_yarda'
      })
    }

    // Verificar que la colección existe
    const coleccion = await prisma.coleccion.findUnique({
      where: { id_coleccion }
    })

    if (!coleccion) {
      return res.status(400).json({
        success: false,
        message: 'Collection not found'
      })
    }

    // Verificar que el código no exista en esta colección
    const existing = await prisma.tela.findUnique({
      where: {
        id_coleccion_codigo: {
          id_coleccion,
          codigo: codigo.toUpperCase()
        }
      }
    })

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Fabric code already exists in this collection'
      })
    }

    const tela = await prisma.tela.create({
      data: {
        id_coleccion,
        codigo: codigo.toUpperCase(),
        color,
        precio_por_yarda,
        descuento,
        disponibilidad,
        visible_publico
      },
      include: {
        coleccion: true
      }
    })

    res.status(201).json({
      success: true,
      data: tela
    })
  } catch (error) {
    console.error('Error creating fabric:', error)
    res.status(500).json({
      success: false,
      message: 'Error creating fabric'
    })
  }
}

/**
 * Actualizar tela (ADMIN only)
 * @route PUT /api/fabrics/:id
 */
exports.updateFabric = async (req, res) => {
  try {
    const { id } = req.params

    const {
      id_coleccion,
      codigo,
      color,
      precio_por_yarda,
      descuento,
      disponibilidad,
      visible_publico
    } = req.body

    // Verificar que la tela existe
    const existing = await prisma.tela.findUnique({
      where: { id_tela: parseInt(id) }
    })

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Fabric not found'
      })
    }

    // Preparar datos de actualización (solo campos enviados)
    const updateData = {}
    if (id_coleccion !== undefined) updateData.id_coleccion = id_coleccion
    if (codigo !== undefined) updateData.codigo = codigo.toUpperCase()
    if (color !== undefined) updateData.color = color
    if (precio_por_yarda !== undefined) updateData.precio_por_yarda = precio_por_yarda
    if (descuento !== undefined) updateData.descuento = descuento
    if (disponibilidad !== undefined) updateData.disponibilidad = disponibilidad
    if (visible_publico !== undefined) updateData.visible_publico = visible_publico

    const tela = await prisma.tela.update({
      where: { id_tela: parseInt(id) },
      data: updateData,
      include: {
        coleccion: true
      }
    })

    res.json({
      success: true,
      data: tela
    })
  } catch (error) {
    console.error('Error updating fabric:', error)
    res.status(500).json({
      success: false,
      message: 'Error updating fabric'
    })
  }
}

/**
 * Cambiar disponibilidad de tela (ADMIN only)
 * @route PATCH /api/fabrics/:id/availability
 */
exports.updateAvailability = async (req, res) => {
  try {
    const { id } = req.params
    const { disponibilidad } = req.body

    const validValues = ['disponible', 'agotado', 'por_pedido', 'descontinuado']
    if (!disponibilidad || !validValues.includes(disponibilidad)) {
      return res.status(400).json({
        success: false,
        message: `Invalid availability value. Must be one of: ${validValues.join(', ')}`
      })
    }

    const tela = await prisma.tela.update({
      where: { id_tela: parseInt(id) },
      data: { disponibilidad },
      include: {
        coleccion: true
      }
    })

    if (!tela) {
      return res.status(404).json({
        success: false,
        message: 'Fabric not found'
      })
    }

    res.json({
      success: true,
      data: tela
    })
  } catch (error) {
    console.error('Error updating availability:', error)
    res.status(500).json({
      success: false,
      message: 'Error updating availability'
    })
  }
}

/**
 * Eliminar tela (ADMIN only)
 * @route DELETE /api/fabrics/:id
 */
exports.deleteFabric = async (req, res) => {
  try {
    // Verificar que no haya cotizaciones asociadas
    const cotizacionesCount = await prisma.cotizacion.count({
      where: { id_tela: parseInt(req.params.id) }
    })

    if (cotizacionesCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete fabric with existing quotations'
      })
    }

    await prisma.tela.delete({
      where: { id_tela: parseInt(req.params.id) }
    })

    res.json({
      success: true,
      message: 'Fabric deleted successfully'
    })
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Fabric not found'
      })
    }
    console.error('Error deleting fabric:', error)
    res.status(500).json({
      success: false,
      message: 'Error deleting fabric'
    })
  }
}
