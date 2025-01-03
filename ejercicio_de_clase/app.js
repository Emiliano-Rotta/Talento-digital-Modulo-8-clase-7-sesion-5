const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

const PORT = 3000;

// Crear directorios necesarios
const uploadDir = path.join(__dirname, 'uploads');
const dbPath = path.join(__dirname, 'db/imagenes.json');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
if (!fs.existsSync(path.dirname(dbPath))) fs.mkdirSync(path.dirname(dbPath));
if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, '[]', 'utf-8');

// Middleware para archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Rutas
const imagenesRoutes = require('./routes/imagenes');
app.use('/api/imagenes', imagenesRoutes);

// Servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
