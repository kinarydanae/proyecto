const BASE_API = "http://localhost:3000/api/registros"; // URL limpia
const LOAD_API = `${BASE_API}?limit=100`; // URL con límite solo para cargar

const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

// Redirecciones de seguridad (Correcto)
if (!token) window.location.href = "login.html";
if (role !== "admin") {
    alert("No tienes permiso");
    window.location.href = "index.html";
}

function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}

async function crearRegistro() {
    const nombre = document.getElementById("nuevoNombre").value;
    const correo = document.getElementById("nuevoCorreo").value;
    const actividad = document.getElementById("nuevaActividad").value;

    const res = await fetch(BASE_API, { // Usamos BASE_API
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ nombre, correo, actividad })
    });

    const data = await res.json();
    alert(data.mensaje || "Registro creado");
    
    // Limpiar campos
    document.getElementById("nuevoNombre").value = "";
    document.getElementById("nuevoCorreo").value = "";
    document.getElementById("nuevaActividad").value = "";
    cargarRegistros();
}

async function cargarRegistros() {
    const res = await fetch(LOAD_API, { // Aquí sí usamos el límite
        headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await res.json();
    const tabla = document.getElementById("tablaRegistros");
    tabla.innerHTML = "";

    data.registros.forEach(reg => {
        tabla.innerHTML += `
            <tr>
                <td>${reg._id.substring(reg._id.length - 5)}...</td> <td>${reg.nombre}</td>
                <td>${reg.correo}</td>
                <td>${reg.actividad}</td>
                <td>
                    <button class="eliminar" onclick="eliminar('${reg._id}')">Eliminar</button>
                    <button class="editar" onclick="editar(this, '${reg._id}')">Editar</button>
                </td>
            </tr>
        `;
    });
}

async function eliminar(id) {
    if (!confirm("¿Eliminar registro?")) return;
    const res = await fetch(`${BASE_API}/${id}`, { // BASE_API sin el ?limit
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await res.json();
    alert(data.mensaje);
    cargarRegistros();
}

function editar(btn, id) {
    const fila = btn.parentElement.parentElement; // Usamos el botón pasado por 'this'
    const nombre = fila.children[1].textContent;
    const correo = fila.children[2].textContent;
    const actividad = fila.children[3].textContent;

    fila.children[1].innerHTML = `<input type="text" id="nombre-${id}" value="${nombre}" style="width:90%">`;
    fila.children[2].innerHTML = `<input type="email" id="correo-${id}" value="${correo}" style="width:90%">`;
    fila.children[3].innerHTML = `<input type="text" id="actividad-${id}" value="${actividad}" style="width:90%">`;

    fila.children[4].innerHTML = `
        <button class="guardar" onclick="guardar('${id}')">Guardar</button>
        <button onclick="cargarRegistros()">Cancelar</button>
    `;
}

async function guardar(id) {
    const nombre = document.getElementById(`nombre-${id}`).value;
    const correo = document.getElementById(`correo-${id}`).value;
    const actividad = document.getElementById(`actividad-${id}`).value;

    const res = await fetch(`${BASE_API}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ nombre, correo, actividad })
    });

    const data = await res.json();
    alert(data.mensaje || "Actualizado");
    cargarRegistros();
}