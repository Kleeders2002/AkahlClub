/**
 * 💰 PRICING CONTROLLER - CATÁLOGO (AKAHL ATELIER)
 * Lógica de negocio para precios y cotizaciones
 *
 * Este módulo es exclusivo del CATÁLOGO
 */

const { prisma } = require('../../../config/database');

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
      }))
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
 * Actualizar tipos de prenda (ADMIN only)
 * @route PUT /api/pricing/tipos-prenda
 */
exports.updateTipoPrenda = async (req, res) => {
  try {
    const { tipos_prenda } = req.body

    if (!tipos_prenda || !Array.isArray(tipos_prenda)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid tipos_prenda structure. Expected array.'
      })
    }

    const resultados = []
    for (const tipo of tipos_prenda) {
      const { id_tipo_prenda, codigo, yardas_requeridas, costo_manufactura, costo_envio, costo_forro, markup } = tipo

      if (!id_tipo_prenda) {
        continue
      }

      const updateData = {}
      if (yardas_requeridas !== undefined) updateData.yardas_requeridas = yardas_requeridas
      if (costo_manufactura !== undefined) updateData.costo_manufactura = costo_manufactura
      if (costo_envio !== undefined) updateData.costo_envio = costo_envio
      if (costo_forro !== undefined) updateData.costo_forro = costo_forro
      if (markup !== undefined) updateData.markup = markup

      const resultado = await prisma.tipoPrenda.update({
        where: { id_tipo_prenda },
        data: updateData
      })

      resultados.push(resultado)
    }

    res.json({
      success: true,
      data: resultados,
      message: 'Tipos de prenda actualizados exitosamente'
    })
  } catch (error) {
    console.error('Error updating tipo prenda:', error)
    res.status(500).json({
      success: false,
      message: 'Error updating tipo prenda'
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
        include: {
          coleccion: {
            include: {
              marca: true
            }
          }
        }
      })
    } else {
      tela = await prisma.tela.findUnique({
        where: { id_tela: parseInt(id_tela) },
        include: {
          coleccion: {
            include: {
              marca: true
            }
          }
        }
      })
    }

    if (!tela) {
      return res.status(404).json({
        success: false,
        message: 'Tela no encontrada'
      })
    }

    // Obtener valores base
    const yardas_requeridas = parseFloat(tipoPrenda.yardas_requeridas)
    const precio_neto = parseFloat(tela.precio_neto)
    const costo_manufactura = parseFloat(tipoPrenda.costo_manufactura)
    const costo_envio = parseFloat(tipoPrenda.costo_envio)
    const costo_forro = parseFloat(tipoPrenda.costo_forro)
    const markup = parseFloat(tipoPrenda.markup)

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
        codigo_completo: `${tela.coleccion.marca.nombre} ${tela.coleccion.nombre} ${tela.codigo}`,
        coleccion: tela.coleccion.nombre,
        marca: tela.coleccion.marca.nombre,
        precio_por_yarda: parseFloat(tela.precio_por_yarda),
        descuento: parseFloat(tela.descuento),
        precio_neto
      },
      tipo_prenda: {
        id: tipoPrenda.id_tipo_prenda,
        nombre: tipoPrenda.nombre,
        codigo: tipoPrenda.codigo
      },
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
            coleccion: {
              include: {
                marca: true
              }
            }
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
 * Calcular precios para TODOS los tipos de prenda de una sola vez
 * @route POST /api/pricing/calculate-all
 * ⚡ SUPER EFICIENTE: 2 queries únicos, todo el cálculo en memoria
 */
exports.calculateAllPrices = async (req, res) => {
  try {
    const { codigo_tela, id_tela } = req.body

    // Validación
    if (!codigo_tela && !id_tela) {
      return res.status(400).json({
        success: false,
        message: 'Either codigo_tela or id_tela is required'
      })
    }

    // ⚡ OPTIMIZACIÓN: Un solo query para obtener la tela con sus relaciones
    let tela
    if (codigo_tela) {
      tela = await prisma.tela.findFirst({
        where: { codigo: codigo_tela.toUpperCase() },
        include: {
          coleccion: {
            include: {
              marca: true
            }
          }
        }
      })
    } else {
      tela = await prisma.tela.findUnique({
        where: { id_tela: parseInt(id_tela) },
        include: {
          coleccion: {
            include: {
              marca: true
            }
          }
        }
      })
    }

    if (!tela) {
      return res.status(404).json({
        success: false,
        message: 'Tela no encontrada'
      })
    }

    // ⚡ OPTIMIZACIÓN: Un solo query para obtener TODOS los tipos de prenda
    const tiposPrenda = await prisma.tipoPrenda.findMany({
      orderBy: { codigo: 'asc' }
    })

    const precio_neto = parseFloat(tela.precio_neto)

    // ⚡ CÁLCULO EN MEMORIA: Super rápido, sin queries adicionales
    const precios = tiposPrenda.map(tipo => {
      const yardas_requeridas = parseFloat(tipo.yardas_requeridas)
      const costo_manufactura = parseFloat(tipo.costo_manufactura)
      const costo_envio = parseFloat(tipo.costo_envio)
      const costo_forro = parseFloat(tipo.costo_forro)
      const markup = parseFloat(tipo.markup)

      // Cálculos
      const costo_tela = precio_neto * yardas_requeridas
      const gastos_fijos = costo_manufactura + costo_envio + costo_forro
      const costo_total = costo_tela + gastos_fijos
      const precio_final = costo_total * markup

      return {
        tipo_prenda: tipo.nombre,
        codigo: tipo.codigo,
        precio_final: Math.round(precio_final * 100) / 100,
        desglose: {
          costo_tela: Math.round(costo_tela * 100) / 100,
          gastos_fijos: Math.round(gastos_fijos * 100) / 100,
          costo_total: Math.round(costo_total * 100) / 100,
          markup: Math.round(markup * 100) / 100,
          yardas_requeridas
        }
      }
    })

    res.json({
      success: true,
      data: {
        tela: {
          id_tela: tela.id_tela,
          codigo: tela.codigo,
          codigo_completo: `${tela.coleccion.marca.nombre} ${tela.coleccion.nombre} ${tela.codigo}`,
          coleccion: tela.coleccion.nombre,
          marca: tela.coleccion.marca.nombre,
          precio_por_yarda: parseFloat(tela.precio_por_yarda),
          descuento: parseFloat(tela.descuento),
          precio_neto
        },
        precios
      }
    })
  } catch (error) {
    console.error('Error calculating all prices:', error)
    res.status(500).json({
      success: false,
      message: 'Error calculating prices'
    })
  }
}

/**
 * Obtener vista pública del catálogo
 * @route GET /api/pricing/public-catalog
 */
exports.getPublicCatalog = async (req, res) => {
  try {
    const { tipo_prenda_codigo } = req.query

    let whereClauses = []
    let paramCount = 0

    if (tipo_prenda_codigo) {
      paramCount++
      whereClauses.push(`tipo_prenda_codigo = $${paramCount}`)
    }

    const whereSQL = whereClauses.length > 0
      ? `WHERE ${whereClauses.join(' AND ')}`
      : ''

    const query = `
      SELECT * FROM vista_publica_catalogo
      ${whereSQL}
      ORDER BY coleccion, codigo, tipo_prenda
    `

    let vista
    if (tipo_prenda_codigo) {
      const params = []
      if (tipo_prenda_codigo) params.push(tipo_prenda_codigo)

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
