const form = document.getElementById("registerForm");

form.addEventListener("submit", async (e) => {

  e.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const correo = document.getElementById("correo").value;
  const password = document.getElementById("password").value;

  const errorMsg = document.getElementById("error");

  errorMsg.textContent = "";

  try {

    const res = await fetch("http://localhost:3000/api/auth/register", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        nombre,
        correo,
        password
      })

    });

    const data = await res.json();

    if (res.ok) {

      alert("Cuenta creada exitosamente");

      window.location.href = "login.html";

    } else {

      errorMsg.textContent =
        data.error || "Error al registrar usuario";

    }

  } catch (error) {

    errorMsg.textContent =
      "Error de conexión con el servidor";

  }

});