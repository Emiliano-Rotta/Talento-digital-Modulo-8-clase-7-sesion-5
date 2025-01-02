const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const uploadDir = path.join(__dirname, '../uploads');

// Ruta para subir archivos
router.post('/upload', (req, res) => {
  let fileData = [];
  const boundary = req.headers['content-type'].split('boundary=')[1];

  req.on('data', (chunk) => {
    fileData.push(chunk);
  });

  req.on('end', () => {
    const buffer = Buffer.concat(fileData);
    const parts = buffer.toString().split(`--${boundary}`);
    const filePart = parts.find((part) => part.includes('Content-Disposition: form-data; name="archivo"'));

    if (!filePart) {
      return res.status(400).json({ error: 'Archivo no incluido en la solicitud.' });
    }

    const filenameMatch = filePart.match(/filename="(.+?)"/);
    const originalName = filenameMatch ? filenameMatch[1] : null;

    if (!originalName) {
      return res.status(400).json({ error: 'No se encontró el nombre del archivo.' });
    }

    const fileDataStart = filePart.indexOf('\r\n\r\n') + 4;
    const fileDataEnd = filePart.lastIndexOf('\r\n');
    const fileContent = filePart.substring(fileDataStart, fileDataEnd);

    const uniqueName = `${Date.now()}_${originalName}`;
    const savePath = path.join(uploadDir, uniqueName);

    fs.writeFile(savePath, fileContent, 'binary', (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error al guardar el archivo.' });
      }

      res.status(201).json({
        message: 'Archivo subido correctamente.',
        file: {
          originalName,
          uniqueName,
          uploadDate: new Date(),
        },
        links: [
          { rel: 'listar', href: '/api/archivos' },
          { rel: 'descargar', href: `/uploads/${uniqueName}` },
          { rel: 'eliminar', href: `/api/archivos/${uniqueName}` },
        ],
      });
    });
  });
});

// Ruta para listar archivos
router.get('/', (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Error al listar archivos.' });
    }

    const fileDetails = files.map((file) => {
      const filePath = path.join(uploadDir, file);
      const stats = fs.statSync(filePath);

      return {
        uniqueName: file,
        uploadDate: stats.birthtime,
      };
    });

    res.json(fileDetails);
  });
});

module.exports = router;
