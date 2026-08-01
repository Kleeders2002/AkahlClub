# 🌱 Seed Instructions - COTIZADOR AKAHL

## Instrucciones para cargar datos de telas (SUPERNOVA)

### Paso 1: Verificar que Prisma esté generado

```bash
cd "C:/Users/PC/Desktop/AKAHLClub - copia/portal-vip/server"
npx prisma generate
```

### Paso 2: Ejecutar el seed

```bash
cd "C:/Users/PC/Desktop/AKAHLClub - copia/portal-vip/server/cotizador/prisma"
node seed.cjs
```

### Qué hace el seed:

1. **Crea colección SUPERNOVA** (si no existe)
   - Nombre: SUPERNOVA
   - Proveedor: SUPERNOVA BRANDS
   - Descuento default: 35%

2. **Crea/verifica tipos de prenda** (6 tipos):
   - JACKET (jacket) - 2.5 yardas
   - TROUSERS (trousers) - 1.8 yardas
   - VEST (vest) - 1.2 yardas
   - 2 PIECES (2-piece-suit) - 4.3 yardas
   - 3 PIECES (3-piece-suit) - 5.5 yardas
   - EXECUTIVE DRESS (dress-executive) - 3.0 yardas

3. **Carga 4 telas SUPERNOVA**:
   - 1425000 - $130.00/yd (35% desc → $84.50 net)
   - 1425001 - $130.00/yd (35% desc → $84.50 net)
   - 1425002 - $130.00/yd (35% desc → $84.50 net)
   - 1425000-025 - $130.00/yd (35% desc → $84.50 net)

### Paso 3: Verificar en Admin Panel

1. Inicia Akahl Atelier: `cd "C:/Users/PC/Desktop/Akahl Atelier" && npm run dev`
2. Ingresa PIN: `9999` (Admin)
3. Ve al Admin Panel
4. Deberías ver las 4 telas SUPERNOVA listadas

---

## 📊 Agregar más telas

Para agregar más telas, edita `seed.cjs` y agrega más objetos al array `SUPERNOVA_FABRICS`:

```javascript
{
  codigo: '1425003',
  color: 'SUPERNOVA 1425003',
  precio_por_yarda: 145.00,
  descuento: 0.35,
}
```

Luego ejecuta el seed nuevamente.

---

## 🔍 Verificar datos en la BD

```sql
-- Ver todas las colecciones
SELECT * FROM colecciones;

-- Ver todas las telas
SELECT t.*, c.nombre as coleccion
FROM telas t
JOIN colecciones c ON t.id_coleccion = c.id_coleccion;

-- Ver tipos de prenda
SELECT * FROM tipos_prenda;
```
