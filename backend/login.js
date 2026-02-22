const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {

  e.preventDefault();

  const correo = document.getElementById("correo").value;
  const password = document.getElementById("password").value;
  const errorMsg = document.getElementById("error");

  errorMsg.textContent = "";

  try {
    const res = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        correo,
        password
      })
    });
    const data = await res.json();
    if (res.ok) {
      // guardar token
      localStorage.setItem("token", data.token);

      try {
        // decodificar payload del JWT
        const payload = JSON.parse(
          atob(data.token.split(".")[1])
        );
        localStorage.setItem("role", payload.role);
        localStorage.setItem("nombre", payload.nombre);
      } catch {
        console.error("Error decodificando token");
      }
      window.location.href = "index.html";
    } else {
      errorMsg.textContent =
        data.error || "Correo o contraseña incorrectos";
    }
  } catch (error) {
    errorMsg.textContent =
      "Error de conexión con el servidor";
  }
});