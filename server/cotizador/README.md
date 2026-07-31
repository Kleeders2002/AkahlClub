# AKAHL Cotizador API

Backend endpoints para el sistema de cotización interna de AKAHL.

## 📁 Estructura

```
cotizador-api/
├── models/
│   └── Fabric.js          # Modelo de datos de tela
├── controllers/
│   ├── fabricController.js # Lógica de negocio para telas
│   └── pricingController.js # Lógica de precios
├── routes/
│   ├── fabrics.js         # Rutas de telas
│   └── pricing.js         # Rutas de precios
└── README.md
```

## 🔌 Endpoints

### Telas (Fabrics)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/fabrics` | Listar todas las telas | Token |
| GET | `/api/fabrics/code/:code` | Buscar tela por código | Token |
| GET | `/api/fabrics?q=search` | Buscar telas por texto | Token |
| PUT | `/api/fabrics/:id` | Actualizar tela | Admin |
| PATCH | `/api/fabrics/:id/availability` | Cambiar disponibilidad | Admin |

### Precios (Pricing)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/pricing/config` | Obtener configuración de precios | Token |
| PUT | `/api/pricing/multipliers` | Actualizar multiplicadores | Admin |
| POST | `/api/pricing/calculate` | Calcular precio (opcional) | Token |

## 🔗 Integración

Para agregar estos endpoints al servidor principal, agregar en tu `app.js` o `index.js`:

```javascript
// Cotizador endpoints
const fabricRoutes = require('./cotizador-api/routes/fabrics');
const pricingRoutes = require('./cotizador-api/routes/pricing');

app.use('/api/fabrics', fabricRoutes);
app.use('/api/pricing', pricingRoutes);
```

## 📊 Modelo de Fabric

```javascript
{
  _id: ObjectId,
  code: String,          // "TL-402"
  name: String,          // "Lino Italiano Navy Blue"
  supplier: String,      // "Loro Piana"
  basePricePerMeter: Number,
  availability: String,   // "available" | "out_of_stock"
  category: String,      // "Lino", "Lana", etc.
  weight: String,        // "240g"
  composition: String,   // "100% Lino Italiano"
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Autenticación

Todos los endpoints requieren token JWT en el header:
```
Authorization: Bearer <token>
```

Los endpoints de admin requieren `role: 'ADMIN'` en el token.
