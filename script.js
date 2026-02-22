document.addEventListener("DOMContentLoaded", () => {

    const API_URL = "http://localhost:3000";
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // Redirigir al login si no hay token
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    // Mostrar botón admin SOLO si existe y es admin
    const adminBtn = document.getElementById("adminBtn");
    if (adminBtn && role === "admin") {
        adminBtn.style.display = "inline-block";
    }
    // REGISTRO DESDE EL FORMULARIO 
    const form = document.getElementById("contacto");

    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const nombre = document.getElementById("nombre").value;
            const correo = document.getElementById("correo").value;
            const actividad = document.getElementById("actividad").value;

            try {
                const res = await fetch(`${API_URL}/api/registros`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        nombre,
                        correo,
                        actividad
                    })
                });
                const data = await res.json();
                if (res.ok) {
                    alert(data.mensaje);
                    form.reset();
                } else {
                    alert(data.mensaje || "Error al registrar");
                }
            } catch (err) {
                console.error(err);
                alert("Error al conectar con el servidor");
            }
        });
    }

    // FUNCIONES CRUD
    async function getRegistros() {
        try {
            const res = await fetch(`${API_URL}/api/registros`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return await res.json();
        } catch (err) {
            console.error(err);
        }
    }

    async function updateRegistro(id, data) {
        try {
            const res = await fetch(`${API_URL}/api/registros/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });
            return await res.json();
        } catch (err) {
            console.error(err);
        }
    }

    async function deleteRegistro(id) {
        try {
            const res = await fetch(`${API_URL}/api/registros/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return await res.json();

        } catch (err) {
            console.error(err);
        }
    }
});