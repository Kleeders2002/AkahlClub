# Instrucciones de Migración - Campo Idioma

## Cambios realizados:

### 1. Schema de Prisma (`server/prisma/schema.prisma`)
- Agregado campo `idioma String? @default("es")` al modelo Usuario

### 2. Backend (`server/routes/authRoutes.js`)
- Recibe campo `idioma` del frontend
- Guarda idioma en la base de datos
- Usa el idioma al enviar emails

### 3. Frontend (`src/components/MembershipForm.jsx`)
- Envía `i18n.language` (idioma actual) en el registro

## Pasos para aplicar la migración:

### Opción 1: Desde tu máquina local (recomendado)

```bash
cd server

# Generar la migración
npx prisma migrate dev --name add_user_language

# O si prefieres hacer un push directo (sin archivo de migración)
npx prisma db push
```

### Opción 2: Directamente en Render

Si estás desplegando en Render, el comando `db push` se ejecuta automáticamente durante el deploy si tienes el script correcto en `package.json`.

## Verificación:

Después de la migración, verifica que el campo existe:

```bash
# Entrar a la consola de Prisma
cd server
npx prisma studio

# O con SQL directo (si tienes acceso)
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'Usuario' AND column_name = 'idioma';
```

## Notas importantes:

- El valor por defecto es 'es' (español)
- El frontend envía 'en' o 'es' basado en i18n.language
- Los emails se envían automáticamente en el idioma del usuario
- Si el idioma es null, usa 'es' como fallback

## Para revertir (si es necesario):

```bash
npx prisma migrate resolve --rolled-back [nombre-migracion]
```
