const jswtoken = require("jsonwebtoken")

const autenticarToken = (req,res, next)=>{
    //extraer el token, o capturarlo
    const token = req.header("autenticacion")?.split(" ")[1]
    if(!token){
        res.status(401).json({error: "Acceso denegado, no provee token."})
    }

    //verificacion del token
    jswtoken.verify(token, process.env.JWT_SECRET, (error, usuario) => {
        if (error) res.status(403).json({ Error: "Token Invalido" });
        req.usuario = usuario;
        next();
    });
}

module.exports = autenticarToken