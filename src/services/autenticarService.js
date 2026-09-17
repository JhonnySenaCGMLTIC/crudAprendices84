const jwtoken = require("jsonwebtoken")
const ingresar = (usuario, clave)=>{
    //validar datos del usuario
    //simular bd
    const usuariobd = {
        "usuario":"jhonny",
        "clave": "abc123"
    } 
    if (usuario !== usuariobd.usuario || clave !== usuariobd.clave ){
        return{mensaje: "Usuario y/o clave incorrectos."}
    }
    //crear token
    const token = jwtoken.sign(
        //pasamos datos del usuario
        {user: usuario},
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    )
    return token
}

module.exports = ingresar