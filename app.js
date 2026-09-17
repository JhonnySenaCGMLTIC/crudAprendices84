const express = require('express');
const registroMiddleware = require("./src/middleware/registroMiddleware")
const manejadorErrores = require("./src/middleware/manejadorErrores")
const autenticarToken = require("./src/middleware/autenticar")
const jwtoken = require("jsonwebtoken")

const app = express();
require('dotenv/config');
const port = process.env.PUERTO || 3111;
//middleware body-parser
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//creacion y usu de middleware, ver el tiempo de ejecucion de una peticion
app.use((req,res, next)=>{
    const tiempoMilisegundos = Date.now()
    console.log(`Tiempo: ${tiempoMilisegundos}`)
    next()
})
app.use(registroMiddleware)
//*app.use()

//utilizacion de librea multer
const multer = require("multer")
//configurar almacenamiento
const almacenamiento = multer.diskStorage({
    destination :(req, file, cb)=>{
        cb(null, "misImagenes/")
    },
    filename:(req, file, cb)=> {
        //estraer la extencion, y depues guardar
        const extension = ruta.extname(file.originalname)
        cb(null, `${Date.now()}${extension}`)
    }
})

const cargar = multer({storage: almacenamiento})

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

//endpoint crear un aprendiz
app.post("/api/aprendices", cargar.single("imagen"),(req, res)=>{
    const datoAprendiz = req.body
    
    sistemaArchivo.readFile(rutaArchivoJson, "utf-8", (error, datos)=>{
        if (error) {
            res.status(500).json({ Error: "Error al leer el archivo, conxion bd" })
        }
        const listaAprendices = JSON.parse(datos);
        //modificar datoAprendiz con la ruta de la foto
        datoAprendiz.imagen = req.file? `/misImagenes/${req.file.filename}`:"sin imagen"    
        //adicionar a la lista el nuevo aprendiz
        listaAprendices.push(datoAprendiz)
        //adicionar al archivo el nuevo aprendiz
        sistemaArchivo.writeFile(rutaArchivoJson, JSON.stringify(listaAprendices,null, 2),(error)=>{
            if(error){
                res.status(500).json({Error: "No se puede registrar el aprendiz."})
            }
            res.json(datoAprendiz)
        })
        
    })
})

//Endpoint para editar un aprendiz
app.put("/api/aprendices/:dni", (req, res)=>{
    const dni = parseInt(req.params.dni)
    const datosAprendiz = req.body
    sistemaArchivo.readFile(rutaArchivoJson, "utf-8", (error, datos)=>{
        if (error) {
            res.status(500).json({ Error: "Error al leer el archivo, conxion bd" })
        }
        let listaAprendices = JSON.parse(datos);
        //modificar datos de un aprendiz

        listaAprendices = listaAprendices.map(aprendiz => {
                return aprendiz.dni === dni ? {...aprendiz, ...datosAprendiz } : aprendiz
            })
        //adicionar al archivo el nuevo aprendiz
        sistemaArchivo.writeFile(rutaArchivoJson, JSON.stringify(listaAprendices,null, 2),(error)=>{
            if(error){
                res.status(500).json({Error: "No se puede registrar el aprendiz."})
            }
            res.json(datosAprendiz)
        })
        
    })
})
//endpoint para provocar un erro
app.get("/error", (req, res, next)=>{
    next(new Error("Error provocado"))
})

//endpoint con ruta protegida
app.get("/rutaProtegida", autenticarToken,(req,res)=>{
    res.json({mensaje: "Este es una ruta protegida"})
})

//endpoint inicio sesion para generar token
app.post("/login", (req, res)=>{
    const {usuario, clave} = req.body
    //simular bd
    const usuariobd = {
        "usuario":"jhonny",
        "clave": "abc123"
    }
    //validar datos del usuario
    if (usuario !== usuariobd.usuario || clave !== usuariobd.clave ){
        res.json({mensaje: "Usuario y/o clave incorrectos."})
    }
    //crear token
    const token = jwtoken.sign(
        //pasamos datos del usuario
        {user: usuario},
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    )
    res.json({token})
})

//manejador de errores
app.use(manejadorErrores)

// Modo de escucha del servidor
app.listen(port, () => {
    console.log(`SERVER: http://localhost:${port}`)
})