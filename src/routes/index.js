//consolida las rutas
const {Router} = require("express")
//importar enrutadores de la entidades
const pruebaRouter = require("./pruebaRouter")
const autenticarRouter = require("./autenticarRouter")
const usuariosRouter = require("./usuariosRouter")

const enrutador = Router()

//usar enrutador
enrutador.use("/rutaPrueba", pruebaRouter)
enrutador.use("/autenticar", autenticarRouter)
enrutador.use("/listado", usuariosRouter)

module.exports = enrutador