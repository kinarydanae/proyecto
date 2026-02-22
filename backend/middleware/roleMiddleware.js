function verificarRol(roleRequerido){

    return (req, res, next) => {

        if(!req.user){

            return res.status(401).json({
                mensaje: "Usuario no autenticado"
            });

        }

        if(req.user.role !== roleRequerido){

            return res.status(403).json({
                mensaje: "No tienes permisos para esta acción"
            });

        }

        next();

    };

}

module.exports = verificarRol;