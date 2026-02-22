const jwt = require("jsonwebtoken");

// Verifica que haya token
function verificarToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ mensaje: "Token requerido" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ mensaje: "Token inválido" });
    }

    req.user = user; // aquí viene id, nombre y rol
    next();
  });
}

module.exports = { verificarToken};