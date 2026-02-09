# 🚀 Guía de Configuración de Stripe - Akahl Club

## Paso 1: Crear Cuenta en Stripe

1. Ve a https://stripe.com y crea una cuenta
2. Completa la verificación de la cuenta
3. En el Dashboard, ve a **Developers → API Keys**
4. Obtén tus llaves:
   - **Publishable key**: `pk_test_xxx` (frontend)
   - **Secret key**: `sk_test_xxx` (backend)

## Paso 2: Crear Productos y Precios

### Opción A: Desde el Dashboard (Recomendado para principiantes)

1. Ve a **Products** en el Dashboard
2. Click **Add Product**

**Producto 1 - Akahl Club Plata:**
- Name: `Akahl Club Plata`
- Description: `Membresía Silver - Acceso a comunidad y contenido básico`
- Pricing: `$9.99` - `Recurring` - `Monthly`
- Copia el **Price ID** (empieza con `price_`)

**Producto 2 - Akahl Club Oro:**
- Name: `Akahl Club Oro`
- Description: `Membresía Gold - Acceso completo a contenido premium y consultas personalizadas`
- Pricing: `$19.99` - `Recurring` - `Monthly`
- Copia el **Price ID** (empieza con `price_`)

### Opción B: Con API (Script automático)

```bash
cd server
node scripts/create-stripe-products.js
```

## Paso 3: Configurar Variables de Entorno en Render

Ve a tu servicio en Render Dashboard → **Environment** y agrega:

```env
# Stripe Keys (Test Mode)
STRIPE_SECRET_KEY=sk_test_tu_secret_key_aqui
STRIPE_PUBLISHABLE_KEY=pk_test_tu_publishable_key_aqui
STRIPE_WEBHOOK_SECRET=whsec_tu_webhook_secret_aqui

# Stripe Price IDs
STRIPE_PRICE_PLATA=price_id_del_plan_plata
STRIPE_PRICE_ORO=price_id_del_plan_oro

# Frontend URL (para redirects)
FRONTEND_URL=https://tu-dominio-vercel.vercel.app
```

## Paso 4: Configurar Webhooks

1. Ve a **Developers → Webhooks** en Stripe Dashboard
2. Click **Add endpoint**
3. URL del endpoint: `https://tu-backend-render.onrender.com/api/stripe/webhook`
4. Selecciona estos eventos:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`
5. Click **Add endpoint**
6. Copia el **Signing secret** (empieza con `whsec_`)
7. Actualiza `STRIPE_WEBHOOK_SECRET` en Render

## Paso 5: Configurar Customer Portal

1. Ve a **Settings → Billing** en Stripe Dashboard
2. Activa **Customer Portal**
3. Configura las opciones:
   - ✅ Allow customers to switch plans
   - ✅ Allow customers to cancel subscriptions
   - ✅ Payment methods
4. Configura los productos que aparecerán en el portal

## Paso 6: Probar con Tarjetas de Prueba

Usa estas tarjetas en modo test:

| Número | Resultado |
|--------|-----------|
| `4242 4242 4242 4242` | ✅ Pago exitoso |
| `4000 0000 0000 0002` | ❌ Pago declinado |
| `4000 0000 0000 9995` | ❌ Fondos insuficientes |

**Datos de prueba:**
- CVC: Cualquier 3 dígitos
- Fecha: Cualquier fecha futura
- ZIP: Cualquier código

## Paso 7: Pasar a Producción

Cuando estés listo para producción:

1. Cambia a **Live Mode** en Stripe Dashboard
2. Obtén las API keys de producción (`pk_live_`, `sk_live_`)
3. Actualiza las variables de entorno en Render
4. Crea los productos nuevamente en Live Mode
5. Actualiza los Price IDs
6. Configura el webhook de producción
7. Prueba con una tarjeta real (puedes reembolsar después)

## Verificar Configuración

Para verificar que todo está configurado correctamente:

```bash
# Desde tu máquina local
curl https://tu-backend.onrender.com/api/stripe/test-config
```

Debería responder:
```json
{
  "success": true,
  "message": "Stripe configuration is valid",
  "products": {
    "plata": "price_xxx",
    "oro": "price_xxx"
  }
}
```

## Soporte

- [Documentación de Stripe](https://stripe.com/docs)
- [Stripe Subscriptions](https://stripe.com/docs/billing/subscriptions/overview)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Customer Portal](https://stripe.com/docs/billing/subscriptions/integrating-customer-portal)
