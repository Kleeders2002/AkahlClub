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
Build Command: npm install && npm run migrate
Start Command: npm start
```

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

Tu API estará disponible en: `https://akahl-club-api.onrender.com`

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

# Migraciones de base de datos
npm run migrate
```
