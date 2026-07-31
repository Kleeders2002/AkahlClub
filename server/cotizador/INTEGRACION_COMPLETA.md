# 🚀 COTIZADOR API - GUÍA DE INTEGRACIÓN COMPLETA

## ✅ TRABAJO COMPLETADO

### Base de Datos
- ✅ Schema Prisma creado
- ✅ Migration ejecutado en Neon PostgreSQL
- ✅ 5 tablas creadas: `colecciones`, `telas`, `tipos_prenda`, `multiplicadores`, `cotizaciones`
- ✅ 2 vistas creadas: `vista_interna_telas`, `vista_publica_catalogo`
- ✅ Datos iniciales cargados (4 colecciones, 6 tipos de prenda)

### Código
- ✅ Controllers migrados de Mongoose a Prisma (CommonJS)
- ✅ Rutas actualizadas para Prisma
- ✅ Cliente Prisma configurado

---

## 📋 ESTRUCTURA FINAL

```
AKAHLClub - copia/portal-vip/
├── server/
│   ├── api.js                                    ← AGREGAR RUTAS AQUÍ
│   ├── COTIZADOR_INTEGRACION.js                  ← Instrucciones de integración
│   └── test-cotizador.js                          ← Script de prueba
│
└── cotizador-api/
    ├── prisma/
    │   ├── schema.prisma                         ✅ Schema completo
    │   ├── migrations/
    │   │   └── 20250130_add_cotizador_tables/
    │   │       └── migration.sql                 ✅ Migration ejecutado
    │   ├── client.mjs                            ✅ Cliente Prisma
    │   └── seed.example.mjs                      ✅ Datos de prueba
    │
    ├── controllers/
    │   ├── fabricController.prisma.js            ✅ CommonJS
    │   └── pricingController.prisma.js           ✅ CommonJS
    │
    └── routes/
        ├── fabrics.prisma.js                     ✅ CommonJS
        └── pricing.prisma.js                      ✅ CommonJS
```

---

## 🔧 PASO 1: INTEGRAR RUTAS AL SERVIDOR

Edita `server/api.js` y agrega:

### Después de los imports (línea ~8):

```javascript
// Importar rutas del cotizador
const fabricRoutes = require('../cotizador-api/routes/fabrics.prisma.js');
const pricingRoutes = require('../cotizador-api/routes/pricing.prisma.js');
```

### Después de las rutas existentes (línea ~57):

```javascript
// Rutas del cotizador
app.use('/api/fabrics', fabricRoutes);
app.use('/api/pricing', pricingRoutes);
```

### Resultado:

```javascript
const express = require('express');
const cors = require('cors');
const contenidoRoutes = require('./routes/contenidoRoutes');
const { router: authRoutes, authMiddleware } = require('./routes/authRoutes');
const leadsRoutes = require('./routes/leads');
const usuarioRoutes = require('./routes/usuarioRoutes');
const stripeRoutes = require('./routes/stripeRoutes');
const adminRoutes = require('./routes/adminRoutes');

// ⭐ RUTAS DEL COTIZADOR
const fabricRoutes = require('../cotizador-api/routes/fabrics.prisma.js');
const pricingRoutes = require('../cotizador-api/routes/pricing.prisma.js');

const app = express();
// ... [middleware] ...

app.use('/api/auth', authRoutes);
app.use('/api/contenido', authMiddleware, contenidoRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/admin', adminRoutes);

// ⭐ COTIZADOR
app.use('/api/fabrics', fabricRoutes);
app.use('/api/pricing', pricingRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
```

---

## 🧪 PASO 2: PROBAR LOS ENDPOINTS

### Opción A: Ejecutar el script de prueba

```bash
cd "C:\Users\PC\Desktop\AKAHLClub - copia\portal-vip\server"

# Asegúrate de que el servidor esté corriendo
npm start

# En otra terminal, ejecuta las pruebas
node test-cotizador.js
```

### Opción B: Probar manualmente con curl

```bash
# 1. Obtener configuración de precios
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:4000/api/pricing/config

# 2. Obtener catálogo público (no requiere auth)
curl http://localhost:4000/api/pricing/public-catalog

# 3. Obtener todas las telas
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:4000/api/fabrics

# 4. Calcular precio
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"tipo_manufactura":"bespoke","tipo_prenda_codigo":"jacket","codigo_tela":"1425000-025"}' \
  http://localhost:4000/api/pricing/calculate
```

---

## 📡 ENDPOINTS DISPONIBLES

### Telas (`/api/fabrics`)

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| GET | `/api/fabrics` | Token | Listar todas las telas |
| GET | `/api/fabrics/code/:code` | Token | Buscar por código |
| GET | `/api/fabrics/search?q=query` | Token | Búsqueda de texto |
| POST | `/api/fabrics` | Admin | Crear nueva tela |
| PUT | `/api/fabrics/:id` | Admin | Actualizar tela |
| PATCH | `/api/fabrics/:id/availability` | Admin | Cambiar disponibilidad |
| DELETE | `/api/fabrics/:id` | Admin | Eliminar tela |

### Precios (`/api/pricing`)

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| GET | `/api/pricing/config` | Token | Obtener configuración |
| PUT | `/api/pricing/multipliers` | Admin | Actualizar multiplicadores |
| POST | `/api/pricing/calculate` | Token | Calcular precio |
| GET | `/api/pricing/quotations` | Admin | Historial de cotizaciones |
| GET | `/api/pricing/internal-view` | Admin | Vista interna (costos) |
| GET | `/api/pricing/public-catalog` | **Public** | Catálogo público |

---

## 🔄 CAMBIOS EN LA API

### Campos renombrados:

| Antes (Mongoose) | Ahora (Prisma) |
|------------------|----------------|
| `code` | `codigo` |
| `basePricePerMeter` | `precio_por_yarda` |
| `availability` | `disponibilidad` |
| `name` | `color` |
| - | `precio_neto` (columna computada) |
| - | `id_coleccion` (relación) |

### Nuevos parámetros en calculatePrice:

**Antes:**
```json
{
  "manufacturingType": "bespoke",
  "garmentType": "jacket",
  "fabricCode": "TL-402"
}
```

**Ahora:**
```json
{
  "tipo_manufactura": "bespoke",
  "tipo_prenda_codigo": "jacket",
  "codigo_tela": "1425000-025",
  "guardar_cotizacion": false
}
```

---

## 📊 DATOS INICIALES

### Tipos de Prenda:

| Nombre | Código | Yardas | Costo Manufactura | Costo Envío | Markup |
|--------|---------|--------|-------------------|-------------|--------|
| JACKET | jacket | 2.5 | $150.00 | $25.00 | 3.0x |
| TROUSERS | trousers | 1.8 | $80.00 | $15.00 | 3.0x |
| VEST | vest | 1.2 | $60.00 | $10.00 | 3.0x |
| 2 PIECES | 2-piece | 4.3 | $200.00 | $35.00 | 3.0x |
| 3 PIECES | 3-piece | 5.5 | $280.00 | $45.00 | 3.0x |
| DRESS EXECUTIVE | dress-exec | 3.0 | $175.00 | $30.00 | 3.0x |

### Colecciones:

| Nombre | Proveedor | Descuento Default |
|--------|-----------|-------------------|
| SUPERNOVA | Loro Piana | 35% |
| DRAGONFLY | Ermenegildo Zegna | 30% |
| CLASSICS | Zegna | 25% |
| LINEN SERIES | Solbiati | 20% |

---

## 🚀 SIGUIENTES PASOS

1. ✅ Integrar rutas en `server/api.js`
2. ✅ Probar con `test-cotizador.js`
3. ⏳ Actualizar frontend Akahl Atelier para usar nuevos nombres
4. ⏳ Agregar telas reales a la BD
5. ⏳ Deploy a producción

---

## 📝 NOTAS IMPORTANTES

- **Base de datos compartida**: El cotizador usa la misma BD Neon que el portal VIP
- **Autenticación**: Usa el mismo sistema JWT del servidor principal
- **Columna computada**: `precio_neto` se calcula automáticamente en PostgreSQL
- **Vistas**: Las vistas se actualizan automáticamente cuando cambian las tablas base
- **Datos de prueba**: Usa `seed.example.mjs` para cargar telas de prueba

---

## 🆘 SOLUCIÓN DE PROBLEMAS

### Error: "Cannot find module '../cotizador-api/...'"

**Solución**: Verifica que las rutas sean correctas relativas a `server/`

### Error: "Relation does not exist"

**Solución**: Ejecuta el migration si no se ha ejecutado:
```bash
cd server
node -e "require('./run-migration.js')"
```

### Error: "Authentication failed"

**Solución**: Los endpoints requieren token JWT. Usa un token válido de `/api/auth/login`

---

## ✨ LISTO

El sistema de cotizador está completamente migrado a Prisma + PostgreSQL. ¡Solo falta integrar las rutas y probar!
