/**
 * ============================================================
 *  SCRIPT DE PRUEBA - COTIZADOR API
 * ============================================================
 *
 *  Este script prueba todos los endpoints del cotizador
 *
 *  USO:
 *    node test-cotizador.js
 *
 *  REQUISITOS:
 *    - Servidor corriendo en http://localhost:4000
 *    - Token JWT válido (o crear uno de prueba)
 */

const http = require('http')

// Configuración
const BASE_URL = process.env.API_URL || 'http://localhost:4000'
let TEST_TOKEN = null

// Colores para consola
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  magenta: '\x1b[35m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function logTest(testName) {
  console.log(`\n${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`)
  console.log(`${colors.magenta}📋 TEST: ${testName}${colors.reset}`)
  console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`)
}

async function request(method, path, body = null, token = null) {
  const url = new URL(path, BASE_URL)
  const options = {
    hostname: url.hostname,
    port: url.port || 4000,
    path: url.pathname + url.search,
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  }

  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`
  }

  if (body) {
    options.headers['Content-Length'] = Buffer.byteLength(JSON.stringify(body))
  }

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data)
          resolve({ status: res.statusCode, data: parsed })
        } catch {
          resolve({ status: res.statusCode, data })
        }
      })
    })

    req.on('error', reject)

    if (body) {
      req.write(JSON.stringify(body))
    }

    req.end()
  })
}

async function testServerConnection() {
  logTest('Conexión al Servidor')

  try {
    const response = await request('GET', '/')
    if (response.status === 200 || response.data.includes('funcionando')) {
      log('✅ Servidor responde correctamente', 'green')
      return true
    }
    log('⚠️ Servidor responde pero mensaje inesperado', 'yellow')
    return false
  } catch (error) {
    log('❌ No se pudo conectar al servidor', 'red')
    log(`   Error: ${error.message}`, 'red')
    log(`   Asegúrate de que el servidor esté corriendo en ${BASE_URL}`, 'yellow')
    return false
  }
}

async function testPricingConfig() {
  logTest('Configuración de Precios')

  try {
    const response = await request('GET', '/api/pricing/config', null, TEST_TOKEN)

    if (response.status === 401 && !TEST_TOKEN) {
      log('⚠️ Requiere autenticación. Intentando sin token (vista pública)...', 'yellow')
      // No hay token, saltamos este test
      return null
    }

    if (response.status === 200 && response.data.success) {
      log('✅ Configuración obtenida correctamente', 'green')
      log(`   Tipos de prenda: ${response.data.data.tipos_prenda.length}`, 'blue')
      response.data.data.tipos_prenda.forEach(tipo => {
        log(`   - ${tipo.nombre} (${tipo.codigo}): ${tipo.yardas_requeridas} yardas`, 'blue')
      })
      return true
    }

    log('❌ Respuesta inesperada', 'red')
    log(`   Status: ${response.status}`, 'red')
    return false
  } catch (error) {
    log('❌ Error en la petición', 'red')
    log(`   Error: ${error.message}`, 'red')
    return false
  }
}

async function testGetFabrics() {
  logTest('Obtener Telas')

  try {
    const response = await request('GET', '/api/fabrics', null, TEST_TOKEN)

    if (response.status === 401 && !TEST_TOKEN) {
      log('⚠️ Requiere autenticación', 'yellow')
      return null
    }

    if (response.status === 200 && response.data.success) {
      log('✅ Telas obtenidas correctamente', 'green')
      log(`   Total: ${response.data.count} telas`, 'blue')
      if (response.data.count > 0) {
        log('   Ejemplo:', 'blue')
        const tela = response.data.data[0]
        log(`   - ${tela.codigo}: ${tela.color || 'Sin color'} ($${tela.precio_neto}/yarda)`, 'blue')
      }
      return true
    }

    log('❌ Respuesta inesperada', 'red')
    return false
  } catch (error) {
    log('❌ Error en la petición', 'red')
    return false
  }
}

async function testGetCollections() {
  logTest('Obtener Colecciones')

  try {
    // Usamos una query raw para obtener colecciones directamente
    const response = await request('GET', '/api/pricing/internal-view', null, TEST_TOKEN)

    if (response.status === 401 && !TEST_TOKEN) {
      log('⚠️ Requiere autenticación', 'yellow')
      return null
    }

    if (response.status === 200 && response.data.success) {
      const colecciones = new Set()
      response.data.data.forEach(item => {
        colecciones.add(item.coleccion)
      })

      log('✅ Colecciones obtenidas (de vista interna)', 'green')
      log(`   Total: ${colecciones.size} colecciones`, 'blue')
      colecciones.forEach(col => {
        log(`   - ${col}`, 'blue')
      })
      return true
    }

    log('❌ Respuesta inesperada', 'red')
    return false
  } catch (error) {
    log('❌ Error en la petición', 'red')
    return false
  }
}

async function testPublicCatalog() {
  logTest('Catálogo Público')

  try {
    const response = await request('GET', '/api/pricing/public-catalog')

    if (response.status === 200 && response.data.success) {
      log('✅ Catálogo público obtenido (sin autenticación)', 'green')
      log(`   Total: ${response.data.count} items`, 'blue')

      if (response.data.count > 0) {
        log('   Ejemplo de precios:', 'blue')
        const ejemplo = response.data.data.slice(0, 3)
        ejemplo.forEach(item => {
          log(`   - ${item.coleccion} ${item.color} - ${item.tipo_prenda}: $${item.precio}`, 'blue')
        })
      } else {
        log('   ℹ️ No hay telas con visible_publico=true', 'yellow')
      }
      return true
    }

    log('❌ Respuesta inesperada', 'red')
    return false
  } catch (error) {
    log('❌ Error en la petición', 'red')
    log(`   Error: ${error.message}`, 'red')
    return false
  }
}

async function testPriceCalculation() {
  logTest('Cálculo de Precio')

  try {
    // Primero necesitamos obtener una tela válida
    const telasResponse = await request('GET', '/api/fabrics', null, TEST_TOKEN)

    let codigoTela = null
    if (telasResponse.status === 200 && telasResponse.data.data && telasResponse.data.data.length > 0) {
      codigoTela = telasResponse.data.data[0].codigo
    }

    if (!codigoTela) {
      log('⚠️ No hay telas para probar cálculo', 'yellow')
      return null
    }

    const requestBody = {
      tipo_manufactura: 'bespoke',
      tipo_prenda_codigo: 'jacket',
      codigo_tela: codigoTela
    }

    const response = await request('POST', '/api/pricing/calculate', requestBody, TEST_TOKEN)

    if (response.status === 401) {
      log('⚠️ Requiere autenticación', 'yellow')
      return null
    }

    if (response.status === 200 && response.data.success) {
      const data = response.data.data
      log('✅ Precio calculado correctamente', 'green')
      log(`   Tela: ${data.tela.codigo} - ${data.tela.color}`, 'blue')
      log(`   Colección: ${data.tela.coleccion}`, 'blue')
      log(`   Tipo: ${data.tipo_prenda.nombre} (${data.tipo_manufactura})`, 'blue')
      log(`   Precio final: $${data.precio_final}`, 'green')
      log('   Desglose:', 'blue')
      log(`   - Costo tela: $${data.desglose.costo_tela}`, 'blue')
      log(`   - Gastos fijos: $${data.desglose.gastos_fijos}`, 'blue')
      log(`   - Markup: ${data.desglose.markup}x`, 'blue')
      return true
    }

    log('❌ Error en cálculo', 'red')
    log(`   Status: ${response.status}`, 'red')
    log(`   Message: ${response.data.message}`, 'red')
    return false
  } catch (error) {
    log('❌ Error en la petición', 'red')
    return false
  }
}

async function testSearchFabrics() {
  logTest('Búsqueda de Telas')

  try {
    const response = await request('GET', '/api/fabrics/search?q=super', null, TEST_TOKEN)

    if (response.status === 401) {
      log('⚠️ Requiere autenticación', 'yellow')
      return null
    }

    if (response.status === 200 && response.data.success) {
      log('✅ Búsqueda realizada correctamente', 'green')
      log(`   Resultados: ${response.data.count} telas`, 'blue')
      if (response.data.count > 0) {
        response.data.data.forEach(tela => {
          log(`   - ${tela.codigo}: ${tela.color || 'Sin color'} (${tela.coleccion_nombre})`, 'blue')
        })
      }
      return true
    }

    log('❌ Respuesta inesperada', 'red')
    return false
  } catch (error) {
    log('❌ Error en la petición', 'red')
    return false
  }
}

async function runAllTests() {
  console.log('\n' + '='.repeat(60))
  console.log(`${colors.magenta}🧪 COTIZADOR API - SUITE DE PRUEBAS${colors.reset}`)
  console.log('='.repeat(60) + '\n')

  const results = {
    serverConnection: await testServerConnection(),
    pricingConfig: await testPricingConfig(),
    getCollections: await testGetCollections(),
    publicCatalog: await testPublicCatalog(),
    getFabrics: await testGetFabrics(),
    searchFabrics: await testSearchFabrics(),
    priceCalculation: await testPriceCalculation()
  }

  // Resumen
  console.log('\n' + '='.repeat(60))
  console.log(`${colors.magenta}📊 RESUMEN DE RESULTADOS${colors.reset}`)
  console.log('='.repeat(60) + '\n')

  let passed = 0
  let failed = 0
  let skipped = 0

  for (const [test, result] of Object.entries(results)) {
    if (result === true) {
      log(`✅ ${test}`, 'green')
      passed++
    } else if (result === false) {
      log(`❌ ${test}`, 'red')
      failed++
    } else {
      log(`⏭️  ${test} (omitido)`, 'yellow')
      skipped++
    }
  }

  console.log(`\n${colors.green}Pasados: ${passed}${colors.reset} | ${colors.red}Fallidos: ${failed}${colors.reset} | ${colors.yellow}Omitidos: ${skipped}${colors.reset}`)

  if (failed === 0) {
    log('\n🎉 Todos los tests pasaron exitosamente!', 'green')
  } else {
    log(`\n⚠️ ${failed} test(s) fallaron. Revisa la configuración.`, 'yellow')
  }

  console.log('\n' + '='.repeat(60) + '\n')
}

// Ejecutar tests
runAllTests().catch(error => {
  log('Error ejecutando tests:', 'red')
  console.error(error)
  process.exit(1)
})
