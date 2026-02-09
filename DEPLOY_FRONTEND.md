# 🚀 Guía de Deploy del Frontend en Vercel

## 📋 Variables de Entorno en Vercel

El frontend necesita una variable de entorno para conectarse al backend:

### Paso 1: Entrar a Vercel

Ve a: https://vercel.com/dashboard

### Paso 2: Seleccionar tu proyecto

Busca y selecciona tu proyecto del portal VIP.

### Paso 3: Configurar Variables de Entorno

1. Ve a **Settings** → **Environment Variables**

2. Agrega la siguiente variable:

```
Key: VITE_API_URL
Value: https://akahlclub.onrender.com
```

3. Selecciona los entornos donde aplicar:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

4. Click en **Save**

### Paso 4: Re-deploy

Después de agregar la variable:

1. Ve a la pestaña **Deployments**
2. Encuentra el deployment más reciente
3. Click en los 3 puntos (•••) → **Redeploy**
4. Click en **Redeploy** para confirmar

---

## 🔧 Verificar Localmente

Para probar que la configuración funciona:

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar en desarrollo (usará localhost:4000)
npm run dev

# 3. Construir para producción (usará la URL de Render)
npm run build

# 4. Previsualizar la build de producción
npm run preview
```

---

## ✅ Verificar el Deploy

Después del deploy, prueba:

1. **Abre tu sitio en Vercel**
2. **Abre la consola del navegador** (F12)
3. **Ve a la pestaña Network**
4. **Prueba hacer login o registrarte**
5. **Verifica que las peticiones van a**:
   ```
   https://akahlclub.onrender.com/api/...
   ```

NO debería ir a:
```
http://localhost:4000/api/...
```

---

## 🐛 Troubleshooting

### Error: "Connection Refused" o "CORS"

**Causa**: El frontend todavía apunta a localhost

**Solución**:
1. Verifica que `VITE_API_URL` esté configurada en Vercel
2. Haz un redeploy del proyecto
3. Limpia el cache del navegador (Ctrl + Shift + R)

### Error: "Network Error"

**Causa**: El backend en Render no está corriendo

**Solución**:
1. Verifica el status del backend en Render
2. Revisa los logs en Render
3. Prueba: `curl https://akahlclub.onrender.com/`

---

## 📱 URLs Finales

- **Frontend**: Tu URL en Vercel
- **Backend**: https://akahlclub.onrender.com
- **Health Check Backend**: https://akahlclub.onrender.com/

---

## 🔒 Seguridad

✅ **`.env` está en `.gitignore`** - No se subirá al repositorio

⚠️ **IMPORTANTE**: Nunca subas archivos `.env` con credenciales reales al repositorio.

---

**¡Tu frontend debería estar funcionando con el backend en Render!** 🎉
