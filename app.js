// temas del repaso de la clase de hoy:
//1. Uso del paquete body-parser
//2. Códigos de Respuesta HTTP
// 1xx: informativa
// 2xx: exito
// 3xx: redireccion
// 4xx: errores cliente
// 5xx: errores servidor

//3. express-fileupload subir archivo
//4. Validando Archivos (Extensiones Permitidas, Tamaño maximo)
//5. Eliminando Archivos del Servidor
//6. HATEOAS (Hypermedia As The Engine Of Application State) es un principio de REST que enriquece las respuestas de una API con enlaces (hypermedia) que describen las acciones disponibles para el cliente.

const express = require("express")
const bodyParser = require("body-parser")
const app = express()
const PORT = 3000

app.use(bodyParser.json());//El paquete body-parser es un middleware de Express que facilita el procesamiento de datos enviados en el cuerpo de una solicitud HTTP. Este paquete convierte el cuerpo de las solicitudes entrantes en objetos JSON
app.use(bodyParser.urlencoded({extended: true})) //es necesario para manejar formularios tradicionales en aplicaciones web.

app.post('/datos', (req, res) => {
    const { nombre, edad } = req.body;
    res.status(201).json({ mensaje: `Recibido: ${nombre}, ${edad}` });
});

app.get('/recurso', (req, res) => {
    res.status(200).json({ mensaje: "Solicitud exitosa" });
});

app.get('/error', (req, res) => {
    res.status(404).json({ mensaje: "Recurso no encontrado" });
});

//express-fileupload subir archivo
//En Express, se utiliza el paquete express-fileupload para manejar esta funcionalidad de manera sencilla. Este paquete proporciona middleware que expone los archivos subidos en req.files.

const fileUpload = require('express-fileupload');
app.use(fileUpload());

const validExtensions = ['jpg', 'jpeg', 'png']
const maxSize =  5 * 1024 * 1024 //5MB

app.post('/validate-upload', (req, res) => {
    const archivo = req.files?.archivo;
    if (!archivo) {
        return res.status(400).json({ mensaje: "No se subió ningún archivo" });
    }

    const extension = archivo.name.split('.').pop();
    if (!validExtensions.includes(extension)) {
        return res.status(400).json({ mensaje: "Extensión no permitida" });
    }

    if (archivo.size >= maxSize) {
        return res.status(400).json({ mensaje: "El archivo es demasiado grande" });
    }

    res.status(200).json({ mensaje: "Archivo válido" });
});


app.post('/upload', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No se subió ningún archivo.');
    }

    const archivo = req.files.archivo;
    archivo.mv('./uploads/' + archivo.name, (err) => {
        if (err) return res.status(500).send(err);

        res.send('Archivo subido exitosamente');
    });
});

const fs = require('fs');

app.delete('/delete-file/:name', (req, res) => {
    const fileName = req.params.name;
    const filePath = `./uploads/${fileName}`;

    fs.unlink(filePath, (err) => {
        if (err) return res.status(404).json({ mensaje: "Archivo no encontrado" });

        res.status(200).json({ mensaje: "Archivo eliminado exitosamente" });
    });
});



app.listen(PORT, () => console.log(`Servidor en ejecución en el puerto ${PORT}`));


