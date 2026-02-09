# 🚀 Guía de Deploy en Render - AKahl Club API

## 📋 Pre-requisitos

1. **Cuenta en Render**: [dashboard.render.com](https://dashboard.render.com)
2. **Repositorio en GitHub**: `Kleeders2002/AkahlClub`
3. **Base de datos PostgreSQL**: Ya tienes Neon configurado ✅

---

## 1️⃣ Dar Acceso a Render (Repositorio Privado)

Como tu repositorio es privado, necesitas autorizar a Render:

### Opción A: Desde Render
1. En [dashboard.render.com](https://dashboard.render.com), intenta crear un nuevo Web Service
2. Render te pedirá permiso para acceder a GitHub
3. Acepta los permisos para el repo `Kleeders2002/AkahlClub`

### Opción B: Desde GitHub
1. Ve a tu repositorio en GitHub
2. **Settings** → **Applications** → **OAuth Apps**
3. Busca "Render" y autorízalo

---

## 2️⃣ Crear Web Service en Render

1. Ve a [dashboard.render.com](https://dashboard.render.com)
2. Click en **"New +"** → **"Web Service"**
3. Conecta tu repositorio:
   - Busca: `Kleeders2002/AkahlClub`
   - Selecciónalo y click "Connect"

---

## 3️⃣ Configurar el Web Service

### Configuración Básica:

```
Name: akahl-club-api
Region: Oregon (us-west) o el más cercano a tus usuarios
Branch: master
Root Directory: server
Runtime: Node
```

### Configuración de Build:

```
Build Command: npm install
Start Command: npm start
```

**Explicación:**
- `npm install` - Instala dependencias y genera Prisma Client (gracias al `postinstall`)
- `npm start` - Inicia el servidor con `node api.js`

**Nota**: No ejecutamos migraciones porque la base de datos ya tiene el schema aplicado.

---

## 4️⃣ Variables de Entorno

En la sección **"Environment"** de Render, agrega estas variables:

### Base de Datos:
```
DATABASE_URL = postgresql://neondb_owner:npg_2glkFsBxfJC8@ep-divine-night-ahzpaj4h-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

### Servidor:
```
PORT = 4000
NODE_ENV = production
```

### JWT (Genera una clave segura única):
```
JWT_SECRET = tu-clave-super-secreta-unica-cambiala-en-produccion
```

**Para generar una clave segura:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Email (Gmail SMTP):
```
EMAIL_HOST = smtp.gmail.com
EMAIL_PORT = 587
EMAIL_USER = kleesteban270@gmail.com
EMAIL_PASS = wtfh jazi mrzq asez
EMAIL_FROM = AKAHL Club <kleesteban270@gmail.com>
```

### Frontend URLs:
```
PORTAL_URL = https://tu-frontend-url.vercel.app
CHECKOUT_URL_ORO = https://checkout.systeme.io/tu-producto-oro
```

---

## 5️⃣ Hacer el Deploy

1. Click en **"Create Web Service"**
2. Render construirá y desplegará tu API
3. El proceso tomará ~3-5 minutos
4. Verás los logs en tiempo real

### Si todo sale bien:
- ✅ Status: "Live"
- 🌐 URL: `https://akahlclub.onrender.com`
- 📊 Puedes ver los logs en la pestaña "Logs"

---

## 6️⃣ Verificar el Deploy

Una vez desplegado, prueba estos endpoints:

### Health Check:
```bash
curl https://akahlclub.onrender.com/
```
Debería retornar:
```json
{"message": "API del portal VIP funcionando"}
```

### Probar Lead Capture:
```bash
curl -X POST https://akahlclub.onrender.com/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "phone": "+1234567890",
    "language": "es"
  }'
```

---

## 7️⃣ Actualizar el Frontend

Después del deploy, actualiza tu frontend:

### En `.env` del frontend:
```env
VITE_API_URL=https://akahlclub.onrender.com
```

### Re-deploya el frontend en Vercel

---

## 🔧 Solución de Problemas

### Error: "Cannot find module"
- **Causa**: Falta el `postinstall` en package.json
- **Solución**: Ya está agregado ✅

### Error: "Database connection failed"
- **Causa**: DATABASE_URL incorrecta
- **Solución**: Verifica que la URL sea correcta y tenga `?sslmode=require`

### Error: "Prisma Client not generated"
- **Causa**: Falta ejecutar `prisma generate`
- **Solución**: El `postinstall` ya lo maneja

### Error: "Port already in use"
- **Causa**: Render usa su propio puerto
- **Solución**: Usa `process.env.PORT` (ya está en el código ✅)

### Emails no se envían
- **Causa**: Gmail bloquea apps menos seguras
- **Solución**: Usa [App Passwords de Google](https://support.google.com/accounts/answer/185833)

---

## 📊 Monitoreo

### Ver Logs:
1. Ve al Web Service en Render
2. Pestaña **"Logs"**
3. Verás logs en tiempo real:
   - ✅ `Servidor corriendo en http://localhost:4000`
   - 📧 `Email de bienvenida enviado`
   - ❌ Cualquier error

### Métricas:
- Pestaña **"Metrics"**
- CPU, Memoria, Response time
- Alertas configurables

---

## 🔒 Seguridad

### Recomendaciones:

1. **JWT_SECRET**: Usa una clave única y larga (mínimo 32 caracteres)
2. **DATABASE_URL**: Nunca la compartas públicamente
3. **EMAIL_PASS**: Usa App Passwords de Gmail, no tu contraseña normal
4. **CORS**: Ya está configurado en `api.js` ✅
5. **Rate Limiting**: Considera agregar `express-rate-limit` para producción

---

## 🔄 Actualizaciones Futuras

### Para hacer deploy de cambios:

```bash
# En tu local
git add .
git commit -m "feat: nueva funcionalidad"
git push origin master
```

Render detectará el push y hará deploy automático ✅

---

## 📱 Webhook de Systeme.io (Opcional)

Si necesitas que Systeme.io notifique a tu API cuando se complete un pago:

1. En Systeme.io, configura el webhook:
   - URL: `https://akahlclub.onrender.com/api/webhooks/payment`
   - Evento: "Purchase completed"

2. Crea la ruta en tu servidor (pendiente de implementar)

---

## ✅ Checklist de Deploy

- [ ] Repositorio conectado a Render
- [ ] Variables de entorno configuradas
- [ ] Base de datos conectada (Neon)
- [ ] Health check funcionando
- [ ] Endpoint `/api/leads` probado
- [ ] Endpoint `/api/auth/login` probado
- [ ] Emails enviándose correctamente
- [ ] Frontend actualizado con nueva URL
- [ ] Frontend redeployado en Vercel

---

## 🎯 URLs Finales

- **API**: `https://akahlclub.onrender.com`
- **Frontend**: `https://tu-frontend.vercel.app`
- **Dashboard Render**: [dashboard.render.com](https://dashboard.render.com)

---

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs en Render
2. Verifica las variables de entorno
3. Prueba los endpoints localmente primero
4. Consulta [Documentación de Render](https://render.com/docs)

---

**¡Buena suerte con el deploy! 🚀**
