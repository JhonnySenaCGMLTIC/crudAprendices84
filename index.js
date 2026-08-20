const express = require('express');
const app = express();
require('dotenv/config');
const port = process.env.PUERTO || 3111;

//ruta raiz
app.get('/', (req, res) => {
    res.send('API RESTFUL - CRUD Aprendices');
});

//endpoint para obtener todos los aprendices


// Modo de escucha del servidor
app.listen(port, () => { console.log(`SERVER: http://localhost:${port}`); });