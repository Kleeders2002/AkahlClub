/**
 * Pricing Controller - PRISMA VERSION (CommonJS)
 * Lógica de negocio para precios - AKAHL Cotizador
 *
 * Migrado de Mongoose a Prisma + PostgreSQL
 */

const { PrismaClient } = require('@prisma/client')

// Singleton pattern
const globalForPrisma = global
const prisma = globalForPrisma.prisma_pricing || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma_pricing = prisma
}

/**
 * Obtener configuración de precios completa
 * @route GET /api/pricing/config
 */
exports.getPricingConfig = async (req, res) => {
  try {
    // Obtener tipos de prenda con sus configuraciones
    const tiposPrenda = await prisma.tipoPrenda.findMany({
      orderBy: { codigo: 'asc' }
    })

    // Obtener multiplicadores personalizados (si existen)
    const multiplicadores = await prisma.multiplicador.findMany()

    // Construir configuración
    const config = {
      tipos_prenda: tiposPrenda.map(t => ({
        id: t.id_tipo_prenda,
        nombre: t.nombre,
        codigo: t.codigo,
        yardas_requeridas: parseFloat(t.yardas_requeridas),
        costo_manufactura: parseFloat(t.costo_manufactura),
        costo_envio: parseFloat(t.costo_envio),
        costo_forro: parseFloat(t.costo_forro),
        markup: parseFloat(t.markup)
      })),
      multiplicadores: multiplicadores.length > 0
        ? multiplicadores.reduce((acc, m) => {
            const key = `${m.tipo_manufactura}_${m.tipo_prenda_codigo}`
            acc[key] = {
              tipo_manufactura: m.tipo_manufactura,
              tipo_prenda_codigo: m.tipo_prenda_codigo,
              valor: parseFloat(m.valor)
            }
            return acc
          }, {})
        : null
    }

    res.json({
      success: true,
      data: config
    })
  } catch (error) {
    console.error('Error fetching pricing config:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching pricing configuration'
    })
  }
}

/**
 * Actualizar multiplicadores de precio (ADMIN only)
 * @route PUT /api/pricing/multipliers
 */
exports.updateMultipliers = async (req, res) => {
  try {
    const { multiplicadores } = req.body

    // Verificar que sea admin
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      })
    }

    if (!multiplicadores || !Array.isArray(multiplicadores)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid multiplicadores structure. Expected array.'
      })
    }

    // Procesar cada multiplicador
    const resultados = []
    for (const mult of multiplicadores) {
      const { tipo_manufactura, tipo_prenda_codigo, valor } = mult

      // Validar
      if (!tipo_manufactura || !tipo_prenda_codigo || valor === undefined) {
        continue
      }

      // Verificar que el tipo de prenda existe
      const tipoPrenda = await prisma.tipoPrenda.findUnique({
        where: { codigo: tipo_prenda_codigo }
      })

      if (!tipoPrenda) {
        return res.status(400).json({
          success: false,
          message: `Tipo de prenda no encontrado: ${tipo_prenda_codigo}`
        })
      }

      // Upsert del multiplicador
      const resultado = await prisma.multiplicador.upsert({
        where: {
          tipo_manufactura_tipo_prenda_codigo: {
            tipo_manufactura,
            tipo_prenda_codigo
          }
        },
        update: { valor },
        create: {
          tipo_manufactura,
          tipo_prenda_codigo,
          valor
        }
      })

      resultados.push(resultado)
    }

    // Retornar configuración actualizada
    const config = await getPricingConfigData()

    res.json({
      success: true,
      data: config,
      message: 'Multipliers updated successfully'
    })
  } catch (error) {
    console.error('Error updating multipliers:', error)
    res.status(500).json({
      success: false,
      message: 'Error updating multipliers'
    })
  }
}

/**
 * Calcular precio de una prenda
 * @route POST /api/pricing/calculate
 */
exports.calculatePrice = async (req, res) => {
  try {
    const {
      tipo_manufactura = 'bespoke',
      tipo_prenda_codigo,
      id_tela,
      codigo_tela,
      guardar_cotizacion = false,
      usuario_email,
      usuario_nombre
    } = req.body

    // Validaciones
    if (!tipo_prenda_codigo) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameter: tipo_prenda_codigo'
      })
    }

    if (!id_tela && !codigo_tela) {
      return res.status(400).json({
        success: false,
        message: 'Either id_tela or codigo_tela is required'
      })
    }

    // Obtener tipo de prenda
    const tipoPrenda = await prisma.tipoPrenda.findUnique({
      where: { codigo: tipo_prenda_codigo }
    })

    if (!tipoPrenda) {
      return res.status(400).json({
        success: false,
        message: `Tipo de prenda no encontrado: ${tipo_prenda_codigo}`
      })
    }

    // Obtener la tela
    let tela
    if (codigo_tela) {
      tela = await prisma.tela.findFirst({
        where: { codigo: codigo_tela.toUpperCase() },
        include: { coleccion: true }
      })
    } else {
      tela = await prisma.tela.findUnique({
        where: { id_tela: parseInt(id_tela) },
        include: { coleccion: true }
      })
    }

    if (!tela) {
      return res.status(404).json({
        success: false,
        message: 'Tela no encontrada'
      })
    }

    // Verificar disponibilidad
    if (tela.disponibilidad === 'agotado') {
      return res.status(400).json({
        success: false,
        message: 'Tela agotada'
      })
    }

    if (tela.disponibilidad === 'descontinuado') {
      return res.status(400).json({
        success: false,
        message: 'Tela descontinuada'
      })
    }

    // Obtener valores base
    const yardas_requeridas = parseFloat(tipoPrenda.yardas_requeridas)
    const precio_neto = parseFloat(tela.precio_neto)
    const costo_manufactura = parseFloat(tipoPrenda.costo_manufactura)
    const costo_envio = parseFloat(tipoPrenda.costo_envio)
    const costo_forro = parseFloat(tipoPrenda.costo_forro)

    // Buscar multiplicador personalizado (si existe)
    let markup = parseFloat(tipoPrenda.markup)
    const multiplicadorPersonalizado = await prisma.multiplicador.findUnique({
      where: {
        tipo_manufactura_tipo_prenda_codigo: {
          tipo_manufactura,
          tipo_prenda_codigo
        }
      }
    })

    if (multiplicadorPersonalizado) {
      markup = parseFloat(multiplicadorPersonalizado.valor)
    }

    // Calcular costos
    const costo_tela = precio_neto * yardas_requeridas
    const gastos_fijos = costo_manufactura + costo_envio + costo_forro
    const costo_total = costo_tela + gastos_fijos
    const precio_final = costo_total * markup

    const resultado = {
      precio_final: Math.round(precio_final * 100) / 100,
      tela: {
        id_tela: tela.id_tela,
        codigo: tela.codigo,
        color: tela.color,
        coleccion: tela.coleccion.nombre,
        precio_por_yarda: parseFloat(tela.precio_por_yarda),
        descuento: parseFloat(tela.descuento),
        precio_neto
      },
      tipo_prenda: {
        id: tipoPrenda.id_tipo_prenda,
        nombre: tipoPrenda.nombre,
        codigo: tipoPrenda.codigo
      },
      tipo_manufactura,
      desglose: {
        costo_tela: Math.round(costo_tela * 100) / 100,
        gastos_fijos: Math.round(gastos_fijos * 100) / 100,
        costo_total: Math.round(costo_total * 100) / 100,
        markup: Math.round(markup * 100) / 100,
        yardas_requeridas
      }
    }

    // Guardar cotización si se solicita
    if (guardar_cotizacion) {
      const cotizacion = await prisma.cotizacion.create({
        data: {
          id_tela: tela.id_tela,
          id_tipo_prenda: tipoPrenda.id_tipo_prenda,
          tipo_manufactura,
          precio_calculado: resultado.precio_final,
          costo_tela: resultado.desglose.costo_tela,
          gastos_fijos: resultado.desglose.gastos_fijos,
          markup_aplicado: resultado.desglose.markup,
          yardas_usadas: resultado.desglose.yardas_requeridas,
          usuario_email,
          usuario_nombre
        }
      })

      resultado.cotizacion_guardada = {
        id: cotizacion.id_cotizacion,
        fecha: cotizacion.createdAt
      }
    }

    res.json({
      success: true,
      data: resultado
    })
  } catch (error) {
    console.error('Error calculating price:', error)
    res.status(500).json({
      success: false,
      message: 'Error calculating price'
    })
  }
}

/**
 * Obtener historial de cotizaciones (ADMIN only)
 * @route GET /api/pricing/quotations
 */
exports.getQuotations = async (req, res) => {
  try {
    const { limit = 50, offset = 0, email } = req.query

    const where = email ? { usuario_email: email } : {}

    const cotizaciones = await prisma.cotizacion.findMany({
      where,
      include: {
        tela: {
          include: {
            coleccion: true
          }
        },
        tipo_prenda: true
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
      skip: parseInt(offset)
    })

    const total = await prisma.cotizacion.count({ where })

    res.json({
      success: true,
      count: cotizaciones.length,
      total,
      offset: parseInt(offset),
      data: cotizaciones
    })
  } catch (error) {
    console.error('Error fetching quotations:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching quotations'
    })
  }
}

/**
 * Obtener vista interna de telas con precios (ADMIN only)
 * @route GET /api/pricing/internal-view
 */
exports.getInternalView = async (req, res) => {
  try {
    // Verificar que sea admin
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      })
    }

    const vista = await prisma.$queryRaw`
      SELECT * FROM vista_interna_telas
      ORDER BY coleccion, codigo, tipo_prenda
    `

    res.json({
      success: true,
      count: vista.length,
      data: vista
    })
  } catch (error) {
    console.error('Error fetching internal view:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching internal view'
    })
  }
}

/**
 * Obtener vista pública del catálogo
 * @route GET /api/pricing/public-catalog
 */
exports.getPublicCatalog = async (req, res) => {
  try {
    const { tipo_prenda_codigo, disponibilidad } = req.query

    let whereClauses = []
    let paramCount = 0

    if (tipo_prenda_codigo) {
      paramCount++
      whereClauses.push(`tipo_prenda_codigo = $${paramCount}`)
    }

    if (disponibilidad) {
      // 'disponible' incluye 'disponible' y 'por_pedido'
      if (disponibilidad === 'disponible') {
        whereClauses.push(`estado IN ('Disponible', 'Disponible por pedido')`)
      } else {
        paramCount++
        whereClauses.push(`estado = $${paramCount}`)
      }
    }

    const whereSQL = whereClauses.length > 0
      ? `WHERE ${whereClauses.join(' AND ')}`
      : ''

    const query = `
      SELECT * FROM vista_publica_catalogo
      ${whereSQL}
      ORDER BY coleccion, color, tipo_prenda
    `

    let vista
    if (tipo_prenda_codigo || disponibilidad) {
      const params = []
      if (tipo_prenda_codigo) params.push(tipo_prenda_codigo)
      if (disponibilidad && disponibilidad !== 'disponible') {
        if (disponibilidad === 'Agotado') params.push('Agotado')
        else if (disponibilidad === 'Disponible por pedido') params.push('Disponible por pedido')
        else if (disponibilidad === 'Ya no disponible') params.push('Ya no disponible')
      }

      vista = await prisma.$queryRawUnsafe(query, params)
    } else {
      vista = await prisma.$queryRaw`${query}`
    }

    res.json({
      success: true,
      count: vista.length,
      data: vista
    })
  } catch (error) {
    console.error('Error fetching public catalog:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching public catalog'
    })
  }
}

// Helper function para obtener configuración
async function getPricingConfigData() {
  const tiposPrenda = await prisma.tipoPrenda.findMany({
    orderBy: { codigo: 'asc' }
  })

  const multiplicadores = await prisma.multiplicador.findMany()

  return {
    tipos_prenda: tiposPrenda.map(t => ({
      id: t.id_tipo_prenda,
      nombre: t.nombre,
      codigo: t.codigo,
      yardas_requeridas: parseFloat(t.yardas_requeridas),
      costo_manufactura: parseFloat(t.costo_manufactura),
      costo_envio: parseFloat(t.costo_envio),
      costo_forro: parseFloat(t.costo_forro),
      markup: parseFloat(t.markup)
    })),
    multiplicadores: multiplicadores.reduce((acc, m) => {
      const key = `${m.tipo_manufactura}_${m.tipo_prenda_codigo}`
      acc[key] = {
        tipo_manufactura: m.tipo_manufactura,
        tipo_prenda_codigo: m.tipo_prenda_codigo,
        valor: parseFloat(m.valor)
      }
      return acc
    }, {})
  }
}
