const express = require('express');
const fs = require('fs');
const path = require('path');
// const sharp = require('sharp');

const router = express.Router();
const uploadDir = path.join(__dirname, '../uploads');
const dbPath = path.join(__dirname, '../db/imagenes.json');

// Subir imagen
router.post('/upload', async (req, res) => {
  let fileData = [];
  const boundary = req.headers['content-type'].split('boundary=')[1];

  req.on('data', (chunk) => {
    fileData.push(chunk);
  });

  req.on('end', async () => {
    const buffer = Buffer.concat(fileData);
    const parts = buffer.toString().split(`--${boundary}`);
    const filePart = parts.find((part) => part.includes('Content-Disposition: form-data; name="imagen"'));

    if (!filePart) return res.status(400).json({ error: 'No se incluyó un archivo.' });

    const filenameMatch = filePart.match(/filename="(.+?)"/);
    const originalName = filenameMatch ? filenameMatch[1] : null;

    if (!originalName) return res.status(400).json({ error: 'No se encontró el nombre del archivo.' });

    const extension = originalName.split('.').pop().toLowerCase();
    if (!['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
      return res.status(400).json({ error: 'El archivo debe ser una imagen válida.' });
    }

    const fileDataStart = filePart.indexOf('\r\n\r\n') + 4;
    const fileDataEnd = filePart.lastIndexOf('\r\n');
    const fileContent = filePart.substring(fileDataStart, fileDataEnd);

    if (Buffer.byteLength(fileContent, 'binary') > 3 * 1024 * 1024) {
      return res.status(400).json({ error: 'El tamaño del archivo excede los 3 MB.' });
    }

    const uniqueName = `${Date.now()}_${originalName}`;
    const savePath = path.join(uploadDir, uniqueName);

    fs.writeFileSync(savePath, fileContent, 'binary');

    // Obtener dimensiones con sharp
    // const dimensions = await sharp(savePath).metadata();
    const imageDetails = {
      originalName,
      uniqueName,
      uploadDate: new Date(),
    };

    // Guardar en la base de datos simulada
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    db.push(imageDetails);
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    res.status(201).json({
      message: 'Imagen subida correctamente.',
      image: imageDetails,
      links: [
        { rel: 'listar', href: '/api/imagenes' },
        { rel: 'detalles', href: `/api/imagenes/${uniqueName}` },
        { rel: 'eliminar', href: `/api/imagenes/${uniqueName}` },
      ],
    });
  });
});

// Listar imágenes
router.get('/', (req, res) => {
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  res.json(db);
});

// Obtener detalles de una imagen específica
router.get('/:name', (req, res) => {
  const { name } = req.params;
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  const image = db.find((img) => img.uniqueName === name);

  if (!image) return res.status(404).json({ error: 'Imagen no encontrada.' });

  res.json(image);
});

// Eliminar imagen
router.delete('/:name', (req, res) => {
  const { name } = req.params;
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  const index = db.findIndex((img) => img.uniqueName === name);

  if (index === -1) return res.status(404).json({ error: 'Imagen no encontrada.' });

  const image = db[index];
  const imagePath = path.join(uploadDir, image.uniqueName);
  if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);

  db.splice(index, 1);
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

  res.json({ message: 'Imagen eliminada correctamente.' });
});

module.exports = router;
