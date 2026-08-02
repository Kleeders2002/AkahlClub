const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// GET /api/contenido?idioma=es&tipo=EBOOK
router.get("/", async (req, res) => {
  const { idioma = "es", tipo } = req.query; // filtrar según query params, default español

  try {
    const where = {
      idioma: idioma  // 🌍 FILTRAR POR IDIOMA
    };

    if (tipo) {
      where.tipo = tipo;
    }

    const contenido = await prisma.contenido.findMany({
      where,
      orderBy: { createdAt: "desc" }
    });

    res.json({ success: true, data: contenido, idioma });
  } catch (error) {
    console.error("Error al obtener contenido:", error);
    res.status(500).json({ success: false, message: "No se pudo obtener el contenido" });
  }
});

module.exports = router;
