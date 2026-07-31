# 🚀 COTIZADOR API - Prisma Setup

Este módulo contiene las tablas del sistema de cotizador para AKAHL Club.

## 📋 Estructura

```
cotizador-api/prisma/
├── schema.prisma              # Definición de modelos Prisma
├── migrations/
│   ├── 20250130_add_cotizador_tables/
│   │   └── migration.sql      # Migration con las nuevas tablas
│   └── migration_lock.toml    # Lock file de Prisma
└── seed.example.mjs           # Datos de ejemplo (opcional)
```

## ⚠️ IMPORTANTE

**Este módulo comparte la base de datos existente de AKAHL Club.**

- **Base de datos**: PostgreSQL (Neon)
- **URL**: Usa la misma `DATABASE_URL` del servidor principal
- **Impacto**: Solo agrega tablas nuevas, NO modifica tablas existentes

## 🔄 Tablas que se agregan

| Tabla | Descripción |
|-------|-------------|
| `colecciones` | Líneas de tela (SUPERNOVA, DRAGONFLY...) |
| `telas` | Variantes/colores individuales |
| `tipos_prenda` | Costos fijos y yardaje por tipo |
| `multiplicadores` | Ajustes dinámicos de markup |
| `cotizaciones` | Historial de cotizaciones |
| `vista_interna_telas` | Vista con costos (uso interno) |
| `vista_publica_catalogo` | Vista pública (clientes) |

---

## 🛠️ CÓMO EJECUTAR EL MIGRATION

### Opción 1: Usar Prisma Migrate (Recomendado)

```bash
# Desde la carpeta del servidor principal
cd "C:\Users\PC\Desktop\AKAHLClub - copia\portal-vip\server"

# Ejecutar migration
npx prisma migrate deploy

# Esto aplicará todos los migrations pendientes, incluido el cotizador
```

### Opción 2: Ejecutar SQL directamente

Si prefieres ejecutar el SQL manualmente:

1. Conéctate a tu base de datos Neon
2. Ejecuta el archivo:
   ```
   cotizador-api/prisma/migrations/20250130_add_cotizador_tables/migration.sql
   ```

### Opción 3: Usar el CLI de PostgreSQL

```bash
psql "postgresql://neondb_owner:npg_2glkFsBxfJC8@ep-divine-night-ahzpaj4h-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require" -f cotizador-api/prisma/migrations/20250130_add_cotizador_tables/migration.sql
```

---

## ✅ Verificar que funcionó

Después de ejecutar el migration:

```sql
-- Verificar que las tablas existen
SELECT tablename FROM pg_tables WHERE schemaname = 'public'
  AND tablename IN ('colecciones', 'telas', 'tipos_prenda', 'cotizaciones');

-- Verificar las vistas
SELECT viewname FROM pg_views WHERE schemaname = 'public'
  AND viewname LIKE 'vista_%';

-- Ver datos de prueba
SELECT * FROM "tipos_prenda";
SELECT * FROM "colecciones";
```

---

## 🌱 Cargar datos de ejemplo (Opcional)

```bash
# Desde server/
npx prisma db seed --file=cotizador-api/prisma/seed.example.mjs
```

O ejecutar directamente:

```bash
node cotizador-api/prisma/seed.example.mjs
```

---

## 🔙 Revertir el migration

Si necesitas eliminar las tablas creadas:

```sql
-- En orden inverso por dependencias
DROP VIEW IF EXISTS "vista_publica_catalogo";
DROP VIEW IF EXISTS "vista_interna_telas";
DROP TABLE IF EXISTS "cotizaciones";
DROP TABLE IF EXISTS "multiplicadores";
DROP TABLE IF EXISTS "telas";
DROP TABLE IF EXISTS "tipos_prenda";
DROP TABLE IF EXISTS "colecciones";
DROP TYPE IF EXISTS "TipoManufactura";
DROP TYPE IF EXISTS "Disponibilidad";
```

---

## 📊 Datos iniciales incluidos

El migration incluye:

### Tipos de prenda (tipos_prenda)
- JACKET (2.5 yardas)
- TROUSERS (1.8 yardas)
- VEST (1.2 yardas)
- 2 PIECES (4.3 yardas)
- 3 PIECES (5.5 yardas)
- DRESS EXECUTIVE (3.0 yardas)

### Colecciones de ejemplo
- SUPERNOVA (Loro Piana)
- DRAGONFLY (Ermenegildo Zegna)
- CLASSICS (Zegna)
- LINEN SERIES (Solbiati)

---

## 🔗 Próximos pasos

Una vez ejecutado el migration:

1. ✅ Las tablas están listas en la BD
2. ➡️ Actualizar los controllers del cotizador para usar Prisma
3. ➡️ Integrar los endpoints al servidor principal
4. ➡️ Probar la API con el frontend

---

## 📝 Notas técnicas

- **Columna computada**: `precio_neto` se calcula automáticamente
- **Vistas**: `vista_interna_telas` y `vista_publica_catalogo` se actualizan automáticamente
- **Enums**: `Disponibilidad` y `TipoManufactura` se crean como tipos PostgreSQL
- **Timestamps**: `createdAt` y `updatedAt` se manejan automáticamente
