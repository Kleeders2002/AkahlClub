# Configuración de Variables de Entorno en Render

## Variables de Checkout de Systeme.io

Agrega estas variables en el dashboard de Render:

### 1. Entra a Render Dashboard
https://dashboard.render.com

### 2. Selecciona tu servicio backend
Busca tu servicio Node.js (ej: "akahl-backend" o similar)

### 3. Ve a "Environment" (Environment Variables)

### 4. Agrega las siguientes variables:

```
CHECKOUT_URL_ORO=https://akahlstyle.systeme.io/0fee916e-ab00925a-b40f6434-9fbf5ad1
CHECKOUT_URL_PLATA=https://akahlstyle.systeme.io/0fee916e-ab00925a-b40f6434-9fbf5ad1-7660c707
```

### 5. Click en "Save Changes"
Render hará un redeploy automático.

---

## Diferencia entre Vercel y Render

### 🎨 Vercel (Frontend - React)
- **URL**: https://vercel.com
- **Qué aloja**: El código React del cliente
- **Variables que empiezan con**: `VITE_`
- **Ejemplo**: `VITE_API_URL=https://akahlclub.onrender.com`

### ⚙️ Render (Backend - Node.js)
- **URL**: https://render.com
- **Qué aloja**: El servidor API con Express
- **Variables sin prefijo especial**
- **Ejemplo**: `CHECKOUT_URL_ORO`, `DATABASE_URL`

---

## Flujo Completo

```
Usuario (Frontend Vercel)
    ↓
Formulario de Registro
    ↓
POST a https://akahlclub.onrender.com/api/auth/register
    ↓
Backend (Render) procesa
    ↓
Usa CHECKOUT_URL_ORO o CHECKOUT_URL_PLATA
    ↓
Devuelve URL de pago al frontend
    ↓
Frontend redirige a Systeme.io
```

---

## Verificación

Para verificar que las variables están correctamente configuradas:

### 1. En el código del backend
El backend ahora tiene estas URLs como fallback:

```javascript
// Oro
const oroUrl = process.env.CHECKOUT_URL_ORO ||
  'https://akahlstyle.systeme.io/0fee916e-ab00925a-b40f6434-9fbf5ad1';

// Plata
const plataUrl = process.env.CHECKOUT_URL_PLATA ||
  'https://akahlstyle.systeme.io/0fee916e-ab00925a-b40f6434-9fbf5ad1-7660c707';
```

### 2. En Render Dashboard
Verifica que las variables aparezcan en:
- Environment → Environment Variables
- Deben verse así:
  ```
  CHECKOUT_URL_ORO = https://akahlstyle.systeme.io/0fee916e-ab00925a-b40f6434-9fbf5ad1
  CHECKOUT_URL_PLATA = https://akahlstyle.systeme.io/0fee916e-ab00925a-b40f6434-9fbf5ad1-7660c707
  ```

### 3. Logs del servidor
Los logs deberían mostrar:
```
✅ Usuario creado: [id] - [email]
📊 Estado inicial: LEAD Tier: PLATA Idioma: es
```

---

## URLs Finales de Systeme.io

| Plan | URL de Checkout |
|------|-----------------|
| **ORO** | https://akahlstyle.systeme.io/0fee916e-ab00925a-b40f6434-9fbf5ad1 |
| **PLATA** | https://akahlstyle.systeme.io/0fee916e-ab00925a-b40f6434-9fbf5ad1-7660c707 |

---

## Notas Importantes

1. **Las variables van en RENDER**, no en Vercel
2. El backend usa estas variables para:
   - Enviar URLs correctas en los emails
   - Devolver la URL correcta al frontend
   - Mostrar URL correcta si el usuario intenta hacer login sin pagar

3. **Fallbacks incluidos**: Si las variables no están configuradas, el código usa las URLs hardcoded

4. **Redeploy automático**: Al guardar variables en Render, el servidor se reinicia automáticamente
