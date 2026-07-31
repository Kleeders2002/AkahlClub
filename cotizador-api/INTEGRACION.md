# Integración del Cotizador API al Servidor

Para activar los endpoints del cotizador en tu servidor, agrega lo siguiente a tu archivo principal del servidor (generalmente `server.js`, `app.js` o `index.js`):

---

## 1. Importar las rutas

```javascript
// Cotizador API routes
const fabricRoutes = require('./cotizador-api/routes/fabrics');
const pricingRoutes = require('./cotizador-api/routes/pricing');
```

## 2. Conectar el modelo de Fabric a tu base de datos

Si usas Mongoose, el modelo se conecta automáticamente cuando lo importas. Asegúrate de tener la conexión a MongoDB establecida.

## 3. Usar las rutas en tu app

```javascript
// Cotizador endpoints
app.use('/api/fabrics', fabricRoutes);
app.use('/api/pricing', pricingRoutes);
```

## 4. Middleware de autenticación

Los routes usan un middleware `authenticateToken` que verifica el JWT. Si tu proyecto ya tiene un middleware de autenticación, reemplázalo en los archivos:

- `cotizador-api/routes/fabrics.js` (línea 10-24)
- `cotizador-api/routes/pricing.js` (línea 10-21)

Por tu middleware existente, por ejemplo:

```javascript
const authMiddleware = require('./middleware/auth'); // tu middleware actual

// Y reemplazar authenticateToken por authMiddleware en las rutas
```

## 5. Instalar dependencias (si no las tienes)

```bash
npm install mongoose
```

## 6. Endpoint disponibles después de integrar

```
GET    /api/fabrics                      # Listar telas
GET    /api/fabrics/code/:code          # Buscar por código
GET    /api/fabrics/search?q=query      # Buscar por texto
POST   /api/fabrics                      # Crear tela (admin)
PUT    /api/fabrics/:id                  # Actualizar tela (admin)
PATCH  /api/fabrics/:id/availability     # Cambiar disponibilidad (admin)
DELETE /api/fabrics/:id                  # Eliminar tela (admin)

GET    /api/pricing/config               # Configuración de precios
PUT    /api/pricing/multipliers          # Actualizar multiplicadores (admin)
POST   /api/pricing/calculate            # Calcular precio
```

---

## 7. Testear

Una vez integrado, puedes probar con:

```bash
# Obtener todas las telas (necesitas token válido)
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/api/fabrics

# Buscar tela por código
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/api/fabrics/code/TL-402

# Calcular precio
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"manufacturingType":"bespoke","garmentType":"2-piece-suit","fabricCode":"TL-402"}' \
  http://localhost:3000/api/pricing/calculate
```

---

## ✅ Checklist de integración

- [ ] Importar rutas en servidor principal
- [ ] Conectar rutas a app con `app.use()`
- [ ] Usar middleware de autenticación existente
- [ ] Probar endpoints con Postman o curl
- [ ] Verificar que el modelo Fabric se crea en MongoDB

---

¿Necesitas ayuda con algún paso específico?
