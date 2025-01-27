const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Servir los archivos estáticos generados por Webpack (build de React)
app.use(express.static(path.join(__dirname, "../../dist")));

// Endpoint para evitar 404 en rutas internas
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../dist/index.html"));
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
