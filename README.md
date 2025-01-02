# Ejercicio para realizar:

Crea una API en Express para gestionar imágenes subidas por los usuarios. El sistema debe cumplir los siguientes requisitos:

Subir una imagen:
Valida que el archivo subido sea una imagen (jpg, jpeg, png, gif) y que no supere los 3 MB de tamaño.
Guarda la imagen con un nombre único generado por el servidor.
Registra los siguientes atributos en la base de datos simulada:
Nombre original.
Nombre único generado.
Fecha y hora de subida.
Dimensiones de la imagen (alto y ancho, usando una librería como sharp).

Listar las imágenes:
Implementa una ruta para listar todas las imágenes almacenadas, con sus atributos (nombre original, nombre único, dimensiones, fecha de subida).
Obtener detalles de una imagen específica:
Permite consultar los detalles de una imagen específica por su nombre único.

Eliminar una imagen:
Crea una ruta para eliminar una imagen. Si la imagen no existe, devuelve un error adecuado.

HATEOAS:
Añade enlaces en todas las respuestas que permitan realizar las acciones disponibles (subir, listar, consultar y eliminar imágenes).

Estructura del Proyecto

project/
├── app.js
├── routes/
│   ├── imagenes.js
├── uploads/
├── db/
│   └── imagenes.json
├── public/
│   ├── index.html
│   └── assets/
│       └── js/
│           └── scripts.js
└── package.json
