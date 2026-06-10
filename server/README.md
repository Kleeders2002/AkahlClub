# AKahl Club API - Backend

Servidor backend para el portal VIP de AKahl Club.

## Stack Tecnológico

- **Node.js** + **Express** 5.2.1
- **Prisma ORM** con PostgreSQL
- **JWT** para autenticación
- **Nodemailer** para envío de emails

## Variables de Entorno

Crea un archivo `.env` basado en `.env.example`:

```env
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
PORT=4000
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
EMAIL_FROM="AKAHL Club <your-email@gmail.com>"
PORTAL_URL="https://your-frontend-url.vercel.app"
CHECKOUT_URL_ORO="https://checkout.systeme.io/tu-producto-oro"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
NODE_ENV="production"
```

## Deploy en Render

### 1. Dar acceso a Render (repositorio privado)

1. Ve a tu repositorio en GitHub
2. Settings → Applications → OAuth Apps → Render
3. Autoriza a Render para acceder a tu repo privado

### 2. Crear Web Service en Render

1. Ve a [dashboard.render.com](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Conecta tu repositorio de GitHub: `Kleeders2002/AkahlClub`
4. Configura:

```
Root Directory: server
Build Command: npm install
Start Command: npm start
```

**Nota**: La base de datos ya tiene el schema aplicado, por lo que no se necesitan migraciones.

### 3. Configurar Variables de Entorno en Render

Agrega estas variables en la sección "Environment" de Render:

- `DATABASE_URL` → Tu conexión de Neon
- `PORT` → `4000`
- `EMAIL_HOST` → `smtp.gmail.com`
- `EMAIL_PORT` → `587`
- `EMAIL_USER` → Tu email
- `EMAIL_PASS` → Tu app password de Gmail
- `EMAIL_FROM` → `AKAHL Club <tu-email@gmail.com>`
- `PORTAL_URL` → URL de tu frontend en Vercel
- `CHECKOUT_URL_ORO` → Tu URL de checkout
- `JWT_SECRET` → Genera una clave segura única
- `NODE_ENV` → `production`

### 4. Deploy

Click en "Create Web Service" y Render hará:
- Instalar dependencias
- Generar cliente Prisma
- Ejecutar migraciones de la base de datos
- Iniciar el servidor

Tu API estará disponible en: `https://akahlclub.onrender.com`

## Endpoints Principales

- `GET /` - Health check
- `POST /api/auth/login` - Login de usuarios
- `POST /api/auth/register` - Registro de miembros
- `GET /api/contenido` - Obtener contenido (requiere auth)
- `POST /api/leads` - Captura de leads (pública)

## Scripts Útiles

```bash
# Desarrollo local
npm run dev

# Producción
npm start
```

**Nota**: La base de datos ya está configurada. No se requieren migraciones para el deploy en Render.

---

## 🔐 Sistema de Cambio de Contraseña Obligatorio

El backend ahora incluye un sistema que obliga a los usuarios nuevos a cambiar su contraseña temporal.

### 📁 Archivos Nuevos

```
server/
├── User.model.js          # Modelo con campo isTemporaryPassword
├── auth.middleware.js     # Middleware con verificación de contraseña temporal
└── auth.routes.js         # Rutas actualizadas
```

### 🔄 Flujo de Usuario con Contraseña Temporal

```
1. REGISTRO → Contraseña temporal generada + Email enviado
2. LOGIN → Token con must_change_pwd: true
3. REDIRECT → /change-password (frontend detecta el claim)
4. CAMBIO → Usuario establece nueva contraseña fuerte
5. NUEVO TOKEN → must_change_pwd: false
6. ACCESO → Dashboard permitido
```

### 🔑 Requisitos de Nueva Contraseña

- Mínimo 8 caracteres
- Al menos una mayúscula (A-Z)
- Al menos una minúscula (a-z)
- Al menos un número (0-9)
- Al menos un carácter especial (@$!%*?&)

### 📊 Modelo de Datos Actualizado

```javascript
// User Schema
{
  email: String,
  password: String,
  nombre: String,
  plan: String,
  isTemporaryPassword: Boolean  // ← Nuevo campo
}
```

### 🎯 JWT Payload

```javascript
{
  sub: "userId",
  email: "user@email.com",
  nombre: "Nombre",
  plan: "PLATA",
  must_change_pwd: true/false,  // ← Claim para detectar contraseña temporal
  iat: 1234567890,
  exp: 1234567890
}
```

### 🧪 Testing del Sistema

```bash
# 1. Registrar usuario (recibe contraseña temporal)
curl -X POST https://akahlclub.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","nombre":"Test","plan":"ORO"}'

# 2. Login con contraseña temporal
curl -X POST https://akahlclub.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TEMP_PASS_FROM_EMAIL"}'
# Respuesta incluye: must_change_pwd: true

# 3. Cambiar contraseña (requiere token)
curl -X POST https://akahlclub.onrender.com/api/auth/change-password \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"newPassword":"NewSecure123@"}'
# Devuelve NUEVO token con must_change_pwd: false
```

### ⚠️ Middleware de Protección

El middleware `verifyToken` ahora bloquea accesos no autorizados:

```javascript
// Rutas permitidas con contraseña temporal:
- /api/auth/change-password  (cambiar contraseña)
- /api/auth/logout           (cerrar sesión)
- /api/user/me              (ver perfil)

// Cualquier otra ruta → 403 + "Debes cambiar tu contraseña temporal"
```

### 📧 Configuración de Email

Las contraseñas temporales se envían por email. Configura en `.env`:

```env
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"  # Usa App Password de Google
EMAIL_FROM="AKAHL Club <your-email@gmail.com>"
```

### 🔧 Migración de Usuarios Existentes

Si tienes usuarios existentes, ejecuta:

```javascript
// Marcar todos los usuarios existentes como SIN contraseña temporal
await User.updateMany(
  { isTemporaryPassword: { $exists: false } },
  { $set: { isTemporaryPassword: false } }
);
```
