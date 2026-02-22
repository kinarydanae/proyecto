import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import "./Admin.css";

export default function Admin() {
  const [registros, setRegistros] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [editData, setEditData] = useState({ nombre: "", correo: "", actividad: "" });
  const [nuevo, setNuevo] = useState({ nombre: "", correo: "", actividad: "" });

  const token = localStorage.getItem("token");

  const cargarRegistros = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/registros?limit=50", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setRegistros(data.registros || []);
    } catch (error) {
      console.error(error);
    }
  };

  const crearRegistro = async () => {
    if (!nuevo.nombre || !nuevo.correo.includes("@") || !nuevo.actividad) {
      alert("Por favor completa todos los campos y asegúrate de que el correo tenga '@'");
      return;
    }
    await fetch("http://localhost:3000/api/registros", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(nuevo)
    });
    setNuevo({ nombre: "", correo: "", actividad: "" });
    cargarRegistros();
  };

  const eliminarRegistro = async (id) => {
    if (window.confirm("¿Seguro que quieres eliminar este registro?")) {
      await fetch(`http://localhost:3000/api/registros/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      cargarRegistros();
    }
  };

  const empezarEditar = (registro) => {
    setEditandoId(registro._id);
    setEditData({ nombre: registro.nombre, correo: registro.correo, actividad: registro.actividad });
  };

  const guardarEdicion = async (id) => {
    await fetch(`http://localhost:3000/api/registros/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(editData)
    });
    setEditandoId(null);
    cargarRegistros();
  };

  useEffect(() => { cargarRegistros(); }, []);

  return (
    <>
      <Navbar />
      <div className="admin-container">
        <h2 className="admin-title">Panel de Administración</h2>

        <div className="admin-layout">
          {/* SECCIÓN IZQUIERDA: FORMULARIO */}
          <div className="admin-form-card">
            <h3>Crear Registro</h3>
            <div className="form-group">
              <input
                placeholder="Nombre"
                value={nuevo.nombre}
                onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })}
              />
              <input
                placeholder="Correo"
                value={nuevo.correo}
                onChange={(e) => setNuevo({ ...nuevo, correo: e.target.value })}
              />
              <input
                placeholder="Actividad"
                value={nuevo.actividad}
                onChange={(e) => setNuevo({ ...nuevo, actividad: e.target.value })}
              />
              <button className="btn-create" onClick={crearRegistro}>Crear</button>
            </div>
          </div>

          {/* SECCIÓN DERECHA: TABLA */}
          <div className="admin-table-card">
            <h3>Registros Recientes</h3>
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Actividad</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {registros.map((registro) => (
                    <tr key={registro._id}>
                      <td>
                        {editandoId === registro._id ? (
                          <input value={editData.nombre} onChange={(e) => setEditData({ ...editData, nombre: e.target.value })} />
                        ) : registro.nombre}
                      </td>
                      <td>
                        {editandoId === registro._id ? (
                          <input value={editData.correo} onChange={(e) => setEditData({ ...editData, correo: e.target.value })} />
                        ) : registro.correo}
                      </td>
                      <td>
                        {editandoId === registro._id ? (
                          <input value={editData.actividad} onChange={(e) => setEditData({ ...editData, actividad: e.target.value })} />
                        ) : registro.actividad}
                      </td>
                      <td className="actions-cell">
                        {editandoId === registro._id ? (
                          <>
                            <button className="btn-save" onClick={() => guardarEdicion(registro._id)}>✓</button>
                            <button className="btn-cancel" onClick={() => setEditandoId(null)}>✕</button>
                          </>
                        ) : (
                          <>
                            <button className="btn-edit" onClick={() => empezarEditar(registro)}>Editar</button>
                            <button className="btn-delete" onClick={() => eliminarRegistro(registro._id)}>Eliminar</button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}