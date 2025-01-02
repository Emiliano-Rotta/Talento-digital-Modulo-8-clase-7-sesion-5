// Consigna del Ejercicio
// Crea una API en Express que gestione un sistema de gestión de documentos subidos por los usuarios. El sistema debe incluir las siguientes funcionalidades:

// Subir un archivo:
// Validar que el archivo tenga una extensión permitida (pdf, docx, jpg, png) y un tamaño máximo de 5 MB.
// Al subir un archivo, se debe almacenar con un nombre único generado por el servidor.

// Listar archivos subidos:
// Implementar una ruta que devuelva un listado de todos los archivos almacenados, incluyendo el nombre original, el nombre único y la fecha de subida.

// Obtener un archivo:
// Permitir que el cliente descargue un archivo específico usando su nombre único.

// Eliminar un archivo:
// Implementar una ruta que permita eliminar un archivo del servidor. Si el archivo no existe, devolver un código de error adecuado.

// HATEOAS:
// En todas las respuestas, incluir enlaces que permitan al cliente realizar las acciones disponibles (subir, listar, descargar, y eliminar archivos).

// Estructura del Proyecto
// project/
// ├── app.js
// ├── routes/
// │   ├── archivos.js
// ├── uploads/
// ├── public/
// │   ├── index.html
// │   └── assets/
// │       └── js/
// │           └── scripts.js
// └── package.json


const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// Configuración
const PORT = 3000;
const uploadDir = path.join(__dirname, 'uploads');

// Asegurarse de que la carpeta `uploads` exista
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
const archivosRoutes = require('./routes/archivos');
app.use('/api/archivos', archivosRoutes);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
