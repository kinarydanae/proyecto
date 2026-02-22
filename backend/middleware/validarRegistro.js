function validarRegistro(req, res, next){

    const { nombre, correo, actividad } = req.body;

    if(!nombre || !correo || !actividad){

        return res.status(400).json({

            mensaje: "Todos los campos son obligatorios"

        });

    }

    next();

}

module.exports = validarRegistro;