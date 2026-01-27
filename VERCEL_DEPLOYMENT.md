# 🚀 Guía de Deployment en Vercel

## Frontend (Vercel)

### 1. Preparación

El proyecto ya está configurado con Vite, que es perfecto para Vercel.

### 2. Pasos en Vercel

1. **Ve a** [vercel.com](https://vercel.com)
2. **Importa tu repositorio**: `AkahlClub`
3. **Configura el proyecto:**
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3. Variables de Entorno

Agrega estas variables en **Settings > Environment Variables**:

```
VITE_API_URL=https://tu-backend-production.com
```

**Nota:** En desarrollo local usa `http://localhost:4000`, pero en producción debes usar la URL de tu backend desplegado.

### 4. Deploy

1. Haz clic en **"Deploy"**
2. Vercel detectará automáticamente que es un proyecto Vite
3. Espera unos minutos y obtendrás una URL como: `https://akahl-club.vercel.app`

---

## Backend (Opcional - si también lo quieres deployar)

Para el backend, tienes varias opciones:

### Opción A: Railway / Render / Fly.io
- Servicios recomendados para APIs Node.js + Express
- Soporta PostgreSQL
- Fácil deployment desde GitHub

### Opción B: Vercel Serverless Functions
- Convierte tu Express a serverless functions
- Más complejo pero todo en una plataforma

### Opción C: Mantener en servidor propio (VPS)
- DigitalOcean, AWS EC2, Google Cloud
- Máximo control pero requiere configuración

---

## Variables de Entorno Necesarias

### Frontend (.env)
```bash
VITE_API_URL=http://localhost:4000  # Desarrollo
# o
VITE_API_URL=https://tu-backend.com  # Producción
```

### Backend (.env - en el servidor)
```bash
DATABASE_URL="postgresql://..."
JWT_SECRET="tu-secreto-super-seguro"
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="tu-email@gmail.com"
EMAIL_PASS="tu-app-password"
CORS_ORIGIN="https://tu-frontend-vercel.app"
```

---

## Checklist Pre-Deployment

- [ ] Verificar que todas las APIs usan `import.meta.env.VITE_API_URL`
- [ ] Probar el build localmente: `npm run build`
- [ ] Verificar que el dist se genera correctamente
- [ ] Configurar variables de entorno en Vercel
- [ ] Asegurarse de que el backend tenga CORS configurado para el dominio de Vercel
- [ ] Probar la aplicación en producción

---

## Solución de Problemas Comunes

### Error: "Network Error" o "CORS"
- Verifica que el backend tenga CORS habilitado para tu dominio de Vercel
- Verifica que `VITE_API_URL` esté correctamente configurada

### Error: "Cannot find module"
- Ejecuta `npm install` antes del deploy
- Verifica que `package.json` tenga todas las dependencias

### Error: "404 Not Found"
- Verifica las rutas en tu backend
- Revisa que el archivo `vercel.json` esté configurado correctamente si lo usas

---

## URLs de Producción

**Frontend**: `https://akahl-club.vercel.app` (o tu URL personalizada)
**Backend**: Aún por configurar (usa Railway, Render o tu VPS)

¿Necesitas ayuda con el deployment del backend también?
