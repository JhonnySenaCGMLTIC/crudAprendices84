const express = require('express');
const app = express();
require('dotenv/config');
const port = process.env.PUERTO || 3111;
//libreria para leer archivo
const sistemaArchivo = require('fs');
const ruta = require('path');
//generar una ruta para el archivo aprendices.json
const rutaArchivoJson = ruta.join(__dirname, 'listaDatos.json');
//ruta raiz
app.get('/', (req, res) => {
    res.send('API RESTFUL - CRUD Aprendices');
});

//endpoint para obtener todos los aprendices
app.get('/api/aprendices', (req, res) => {
    //const listaAprendices = []
    sistemaArchivo.readFile(rutaArchivoJson, "utf-8", (error, datos) => {
        if (error) {
            res.status(500).json({ Error: "Error al leer el archivo, conxion bd" })
        }
        const listaAprendices = JSON.parse(datos);
        res.json(listaAprendices);
    });
});
// Modo de escucha del servidor
app.listen(port, () => {
    console.log(`SERVER: http://localhost:${port}`)
})