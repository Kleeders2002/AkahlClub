# 📦 COTIZADOR API - INTEGRACIÓN PRISMA

## ✅ Estado Actual

**Migración completada de Mongoose (MongoDB) a Prisma (PostgreSQL)**

| Componente | Estado | Archivo nuevo |
|------------|--------|---------------|
| Schema Prisma | ✅ Creado | `prisma/schema.prisma` |
| Migration SQL | ✅ Ejecutado | `prisma/migrations/...` |
| Cliente Prisma | ✅ Creado | `prisma/client.mjs` |
| Fabric Controller | ✅ Migrado | `controllers/fabricController.prisma.mjs` |
| Pricing Controller | ✅ Migrado | `controllers/pricingController.prisma.mjs` |
| Fabric Routes | ✅ Migrado | `routes/fabrics.prisma.mjs` |
| Pricing Routes | ✅ Migrado | `routes/pricing.prisma.mjs` |

---

## 🔗 INTEGRACIÓN AL SERVIDOR PRINCIPAL

### Paso 1: Configurar package.json del servidor

Asegúrate de que el servidor tenga Prisma instalado (ya debería estar):

```json
{
  "dependencies": {
    "@prisma/client": "^5.22.0",
    "prisma": "^5.22.0"
  }
}
```

### Paso 2: Actualizar el servidor principal

Edita `server/api.js` para integrar las rutas:

```javascript
// IMPORTAR RUTAS DEL COTIZADOR (versión Prisma)
// Agrega esto después de tus otros imports

import fabricsRouter from '../cotizador-api/routes/fabrics.prisma.mjs'
import pricingRouter from '../cotizador-api/routes/pricing.prisma.mjs'

// ... resto de tu configuración de Express ...

// MONTAR RUTAS DEL COTIZADOR
// Agrega esto después de tus otras rutas

app.use('/api/fabrics', fabricsRouter)
app.use('/api/pricing', pricingRouter)
```

**IMPORTANTE**: Tu servidor principal debe usar ES Modules (`"type": "module"` en package.json) para importar los archivos `.mjs`.

### Paso 3: Regenerar el cliente Prisma

Desde la carpeta del servidor:

```bash
cd "C:\Users\PC\Desktop\AKAHLClub - copia\portal-vip\server"
npx prisma generate
```

Esto genera el cliente Prisma que incluye las nuevas tablas.

---

## 📋 ENDPOINTS DISPONIBLES

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
| GET | `/api/pricing/config` | Token | Obtener configuración completa |
| PUT | `/api/pricing/multipliers` | Admin | Actualizar multiplicadores |
| POST | `/api/pricing/calculate` | Token | Calcular precio |
| GET | `/api/pricing/quotations` | Admin | Historial de cotizaciones |
| GET | `/api/pricing/internal-view` | Admin | Vista interna (costos) |
| GET | `/api/pricing/public-catalog` | Public | Catálogo público |

---

## 🆕 CAMBIOS EN LA API

### Nuevos campos (comparado con Mongoose):

| Antes (Mongoose) | Ahora (Prisma) | Notas |
|------------------|----------------|-------|
| `code` | `codigo` | Nombre más descriptivo |
| `basePricePerMeter` | `precio_por_yarda` | Ahora es por yarda |
| `availability` | `disponibilidad` | Ahora es enum |
| `name` | `color` | Más específico |
| - | `precio_neto` | Columna computada |
| - | `id_coleccion` | Relación con colección |
| - | `visible_publico` | Control de visibilidad |

### Nuevas respuestas de calculatePrice:

**Antes**:
```json
{
  "finalPrice": 950.00,
  "fabric": { "code": "TL-402", "basePricePerMeter": 85 },
  "desglose": { "fabricCost": 212.50, "laborCost": 737.50 }
}
```

**Ahora**:
```json
{
  "precio_final": 950.00,
  "tela": {
    "codigo": "TL-402",
    "color": "Navy Blue",
    "coleccion": "SUPERNOVA",
    "precio_neto": 55.25
  },
  "tipo_prenda": { "nombre": "JACKET", "codigo": "jacket" },
  "tipo_manufactura": "bespoke",
  "desglose": {
    "costo_tela": 138.12,
    "gastos_fijos": 175.00,
    "costo_total": 313.12,
    "markup": 3.0,
    "yardas_requeridas": 2.5
  }
}
```

---

## 🔄 MIGRACIÓN DEL FRONTEND

Si tu frontend Akahl Atelier usa estos endpoints, actualiza:

### 1. Service de telas:

```javascript
// ANTES
const response = await api.get(`/api/fabrics/code/${code}`)
const fabric = response.data.data  // { code, basePricePerMeter, ... }

// AHORA
const response = await api.get(`/api/fabrics/code/${code}`)
const tela = response.data.data  // { codigo, precio_por_yarda, color, ... }

// Actualizar referencias:
// fabric.code → tela.codigo
// fabric.basePricePerMeter → tela.precio_por_yarda
// fabric.availability → tela.disponibilidad
```

### 2. Service de precios:

```javascript
// ANTES
const response = await api.post('/api/pricing/calculate', {
  manufacturingType: 'bespoke',
  garmentType: 'jacket',
  fabricCode: 'TL-402'
})

// AHORA
const response = await api.post('/api/pricing/calculate', {
  tipo_manufactura: 'bespoke',      // ← Cambiado
  tipo_prenda_codigo: 'jacket',      // ← Cambiado
  codigo_tela: 'TL-402'              // ← Cambiado
})

// Respuesta:
const { precio_final, tela, desglose } = response.data.data
// en vez de: finalPrice, fabric, desglose
```

---

## 🧪 PRUEBAS

### Probar el migration:

```bash
# Conectar a la BD y verificar tablas
psql "postgresql://..." -c "\dt"

# Verificar datos
psql "postgresql://..." -c "SELECT * FROM tipos_prenda"
```

### Probar los endpoints:

```bash
# Obtener configuración
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://akahlclub.onrender.com/api/pricing/config

# Calcular precio
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"tipo_manufactura":"bespoke","tipo_prenda_codigo":"jacket","codigo_tela":"1425000-025"}' \
  https://akahlclub.onrender.com/api/pricing/calculate
```

---

## 📝 NOTAS IMPORTANTES

1. **Compatibilidad**: Los nuevos endpoints son backwards compatible con algunas adaptaciones de nombres

2. **Vistas**: Las vistas `vista_interna_telas` y `vista_publica_catalogo` se crearon en el migration

3. **Datos iniciales**: Los tipos de prenda y colecciones ya están cargados en la BD

4. **Test en desarrollo**: Prueba los nuevos endpoints antes de deployar a producción

5. **Frontend**: Actualiza `Akahl Atelier` para usar los nuevos nombres de campos

---

## 🚀 PRÓXIMOS PASOS

1. ✅ Migration ejecutado
2. ✅ Controllers creados
3. ⏳ Integrar rutas al servidor principal
4. ⏳ Actualizar frontend Akahl Atelier
5. ⏳ Probar end-to-end
6. ⏳ Deploy a producción
