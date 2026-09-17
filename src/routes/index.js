//consolida las rutas
const {Router} = require("express")
//importar enrutadores de la entidades
const pruebaRouter = require("./pruebaRouter")
const autenticarRouter = require("./autenticarRouter")

const enrutador = Router()

//usar enrutador
enrutador.use("/rutaPrueba", pruebaRouter)
enrutador.use("/autenticar", autenticarRouter)

module.exports = enrutador