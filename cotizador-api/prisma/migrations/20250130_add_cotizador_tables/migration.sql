-- ============================================================
--  MIGRATION: ADD COTIZADOR TABLES
--  Fecha: 2025-01-30
--
--  Este migration agrega las tablas del sistema de cotizador
--  a la base de datos existente de AKAHL Club.
--
--  NO modifica tablas existentes (Usuario, Contenido, UsuarioContenido)
-- ============================================================


-- ============================================================
--  ENUMS
-- ============================================================

-- Enum de disponibilidad de telas
CREATE TYPE "Disponibilidad" AS ENUM ('disponible', 'agotado', 'por_pedido', 'descontinuado');

-- Enum de tipo de manufactura
CREATE TYPE "TipoManufactura" AS ENUM ('bespoke', 'industrial');


-- ============================================================
--  1. TABLA: colecciones
--     Líneas de tela (SUPERNOVA, DRAGONFLY, etc.)
-- ============================================================

CREATE TABLE "colecciones" (
    "id_coleccion"      SERIAL PRIMARY KEY,
    "nombre"            VARCHAR(100) NOT NULL,
    "proveedor"         VARCHAR(100),
    "descuento_default" DECIMAL(5,2) DEFAULT 0,

    "createdAt"         TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"         TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX "idx_colecciones_nombre" ON "colecciones"("nombre");
CREATE INDEX "idx_colecciones_proveedor" ON "colecciones"("proveedor");


-- ============================================================
--  2. TABLA: tipos_prenda
--     Costos fijos y yardaje por tipo de prenda
-- ============================================================

CREATE TABLE "tipos_prenda" (
    "id_tipo_prenda"     SERIAL PRIMARY KEY,
    "nombre"             VARCHAR(50) NOT NULL UNIQUE,
    "codigo"             VARCHAR(20) NOT NULL UNIQUE,

    "yardas_requeridas"  DECIMAL(5,2)  NOT NULL,
    "costo_manufactura"  DECIMAL(10,2) NOT NULL,
    "costo_envio"        DECIMAL(10,2) NOT NULL,
    "costo_forro"        DECIMAL(10,2) DEFAULT 0,
    "markup"             DECIMAL(5,2)  DEFAULT 3.0,

    "createdAt"          TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"          TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX "idx_tipos_prenda_codigo" ON "tipos_prenda"("codigo");

-- Datos iniciales: Tipos de prenda base
INSERT INTO "tipos_prenda" (nombre, codigo, yardas_requeridas, costo_manufactura, costo_envio, costo_forro, markup) VALUES
('JACKET',           'jacket',        2.5,  150.00, 25.00, 0,   3.0),
('TROUSERS',         'trousers',      1.8,  80.00,  15.00, 0,   3.0),
('VEST',             'vest',          1.2,  60.00,  10.00, 0,   3.0),
('2 PIECES',         '2-piece',       4.3,  200.00, 35.00, 0,   3.0),
('3 PIECES',         '3-piece',       5.5,  280.00, 45.00, 0,   3.0),
('DRESS EXECUTIVE',  'dress-exec',    3.0,  175.00, 30.00, 0,   3.0);


-- ============================================================
--  3. TABLA: telas
--     Variantes/colores individuales de tela
-- ============================================================

CREATE TABLE "telas" (
    "id_tela"           SERIAL PRIMARY KEY,
    "id_coleccion"      INTEGER NOT NULL,

    "codigo"            VARCHAR(50) NOT NULL,
    "color"             VARCHAR(100),

    "precio_por_yarda"  DECIMAL(10,2) NOT NULL,
    "descuento"         DECIMAL(5,2) DEFAULT 0,

    -- COLUMNA COMPUTADA: precio_neto = precio_por_yarda * (1 - descuento)
    "precio_neto"        DECIMAL(10,2) GENERATED ALWAYS AS
                         ("precio_por_yarda" * (1 - "descuento")) STORED,

    "disponibilidad"    "Disponibilidad" DEFAULT 'disponible',
    "visible_publico"   BOOLEAN DEFAULT TRUE,

    "createdAt"         TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"         TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    -- Foreign Key
    CONSTRAINT "fk_telas_coleccion"
        FOREIGN KEY ("id_coleccion")
        REFERENCES "colecciones"("id_coleccion")
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    -- Unique: código único dentro de cada colección
    CONSTRAINT "uq_telas_coleccion_codigo"
        UNIQUE ("id_coleccion", "codigo")
);

-- Índices
CREATE INDEX "idx_telas_codigo" ON "telas"("codigo");
CREATE INDEX "idx_telas_disponibilidad" ON "telas"("disponibilidad");
CREATE INDEX "idx_telas_visible_publico" ON "telas"("visible_publico");
CREATE INDEX "idx_telas_color" ON "telas"("color");


-- ============================================================
--  4. TABLA: multiplicadores
--     Ajustes dinámicos de markup (sobreescriben TipoPrenda.markup)
-- ============================================================

CREATE TABLE "multiplicadores" (
    "id"                SERIAL PRIMARY KEY,
    "tipo_manufactura"  "TipoManufactura" NOT NULL,
    "tipo_prenda_codigo" VARCHAR(20) NOT NULL,

    "valor"             DECIMAL(5,2) NOT NULL,

    "createdAt"         TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"         TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "uq_multiplicadores_manufactura_prenda"
        UNIQUE ("tipo_manufactura", "tipo_prenda_codigo")
);

-- Índices
CREATE INDEX "idx_multiplicadores_manufactura" ON "multiplicadores"("tipo_manufactura");
CREATE INDEX "idx_multiplicadores_prenda" ON "multiplicadores"("tipo_prenda_codigo");


-- ============================================================
--  5. TABLA: cotizaciones
--     Historial de cotizaciones realizadas
-- ============================================================

CREATE TABLE "cotizaciones" (
    "id_cotizacion"     SERIAL PRIMARY KEY,
    "id_tela"           INTEGER NOT NULL,
    "id_tipo_prenda"    INTEGER NOT NULL,
    "tipo_manufactura"  "TipoManufactura" DEFAULT 'bespoke',

    -- Datos calculados (snapshot)
    "precio_calculado"  DECIMAL(12,2) NOT NULL,
    "costo_tela"        DECIMAL(10,2) NOT NULL,
    "gastos_fijos"      DECIMAL(10,2) NOT NULL,
    "markup_aplicado"   DECIMAL(5,2) NOT NULL,
    "yardas_usadas"     DECIMAL(5,2) NOT NULL,

    -- Usuario (opcional si no hay auth en el momento)
    "usuario_email"     VARCHAR(255),
    "usuario_nombre"    VARCHAR(255),

    "createdAt"         TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    -- Foreign Keys
    CONSTRAINT "fk_cotizaciones_tela"
        FOREIGN KEY ("id_tela")
        REFERENCES "telas"("id_tela")
        ON DELETE RESTRICT,

    CONSTRAINT "fk_cotizaciones_tipo_prenda"
        FOREIGN KEY ("id_tipo_prenda")
        REFERENCES "tipos_prenda"("id_tipo_prenda")
        ON DELETE RESTRICT
);

-- Índices
CREATE INDEX "idx_cotizaciones_usuario_email" ON "cotizaciones"("usuario_email");
CREATE INDEX "idx_cotizaciones_created_at" ON "cotizaciones"("createdAt");
CREATE INDEX "idx_cotizaciones_id_tela" ON "cotizaciones"("id_tela");


-- ============================================================
--  VISTAS
-- ============================================================

-- ------------------------------------------------------------
--  VISTA INTERNA: vista_interna_telas
--  Uso exclusivo del equipo/administración
--  Incluye costos, descuentos, gastos fijos y márgenes
-- ------------------------------------------------------------
CREATE VIEW "vista_interna_telas" AS
SELECT
    t."id_tela",
    c.nombre AS "coleccion",
    t."codigo",
    t."color",
    t."precio_por_yarda",
    t."descuento",
    t."precio_neto",
    t."disponibilidad",
    t."visible_publico",
    tp."id_tipo_prenda",
    tp.nombre AS "tipo_prenda",
    tp.codigo AS "tipo_prenda_codigo",
    ROUND(t."precio_neto" * tp."yardas_requeridas", 2) AS "costo_tela",
    (tp."costo_manufactura" + tp."costo_envio" + tp."costo_forro") AS "gastos_fijos",
    ROUND(t."precio_neto" * tp."yardas_requeridas"
          + tp."costo_manufactura" + tp."costo_envio" + tp."costo_forro", 2) AS "costo_total",
    ROUND((t."precio_neto" * tp."yardas_requeridas"
          + tp."costo_manufactura" + tp."costo_envio" + tp."costo_forro") * tp."markup", 2) AS "precio_venta",
    tp."yardas_requeridas",
    tp."markup"
FROM "telas" t
JOIN "colecciones" c ON c."id_coleccion" = t."id_coleccion"
CROSS JOIN "tipos_prenda" tp;


-- ------------------------------------------------------------
--  VISTA PÚBLICA: vista_publica_catalogo
--  Lo único que la app/sitio de clientes consulta
--  NO expone precios por yarda, descuentos ni costos
-- ------------------------------------------------------------
CREATE VIEW "vista_publica_catalogo" AS
SELECT
    t."id_tela",
    tp."id_tipo_prenda",
    c.nombre AS "coleccion",
    t."color",
    CASE t."disponibilidad"
        WHEN 'disponible'    THEN 'Disponible'
        WHEN 'agotado'       THEN 'Agotado'
        WHEN 'por_pedido'    THEN 'Disponible por pedido'
        WHEN 'descontinuado' THEN 'Ya no disponible'
    END AS "estado",
    tp.nombre AS "tipo_prenda",
    tp.codigo AS "tipo_prenda_codigo",
    ROUND((t."precio_neto" * tp."yardas_requeridas"
          + tp."costo_manufactura" + tp."costo_envio" + tp."costo_forro") * tp."markup", 2) AS "precio"
FROM "telas" t
JOIN "colecciones" c ON c."id_coleccion" = t."id_coleccion"
CROSS JOIN "tipos_prenda" tp
WHERE t."visible_publico" = TRUE;


-- ============================================================
--  DATOS INICIALES: Colecciones de ejemplo
-- ============================================================

INSERT INTO "colecciones" (nombre, proveedor, descuento_default) VALUES
('SUPERNOVA',     'Loro Piana',    0.35),
('DRAGONFLY',     'Ermenegildo',   0.30),
('CLASSICS',      'Zegna',          0.25),
('LINEN SERIES',  'Solbiati',       0.20);


-- ============================================================
--  COMENTARIOS FINALES
-- ============================================================

-- El migration está diseñado para ser ejecutado en una BD existente
-- No modifica tablas: Usuario, Contenido, UsuarioContenido
-- Todas las nuevas tablas están en el schema "public" (default de PostgreSQL)

-- Para revertir este migration:
-- DROP VIEW IF EXISTS "vista_publica_catalogo";
-- DROP VIEW IF EXISTS "vista_interna_telas";
-- DROP TABLE IF EXISTS "cotizaciones";
-- DROP TABLE IF EXISTS "multiplicadores";
-- DROP TABLE IF EXISTS "telas";
-- DROP TABLE IF EXISTS "tipos_prenda";
-- DROP TABLE IF EXISTS "colecciones";
-- DROP TYPE IF EXISTS "TipoManufactura";
-- DROP TYPE IF EXISTS "Disponibilidad";
