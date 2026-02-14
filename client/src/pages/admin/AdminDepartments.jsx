import { useEffect, useState } from "react";
import api from "../../api/api";

export default function AdminDepartments() {
  const [list, setList] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const load = () => api.get("/api/departments").then(r => setList(r.data));
  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    await api.post("/api/departments", { name, description });
    setName(""); setDescription("");
    load();
  };

  const edit = async (id) => {
    const newName = prompt("New name?");
    if (!newName) return;
    await api.put(`/api/departments/${id}`, { name: newName });
    load();
  };

  const del = async (id) => {
    if (!confirm("Delete department?")) return;
    await api.delete(`/api/departments/${id}`);
    load();
  };

  return (
    <>
      <h2>Department Management</h2>

      <form className="card grid" onSubmit={add} style={{ maxWidth: 520 }}>
        <input className="input" placeholder="Department name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input className="input" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
        <button className="btn btn-primary">Add Department</button>
      </form>

      <div className="card" style={{ marginTop: 14 }}>
        <table className="table">
          <thead><tr><th>Name</th><th>Description</th><th>Actions</th></tr></thead>
          <tbody>
            {list.map(d => (
              <tr key={d._id}>
                <td>{d.name}</td>
                <td>{d.description}</td>
                <td>
                  <button className="btn" onClick={() => edit(d._id)}>Edit</button>{" "}
                  <button className="btn" onClick={() => del(d._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
