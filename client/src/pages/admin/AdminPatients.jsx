import { useEffect, useState } from "react";
import api from "../../api/api";

export default function AdminPatients() {
  const [q, setQ] = useState("");
  const [list, setList] = useState([]);

  const load = async () => {
    const res = await api.get(`/api/patients?q=${encodeURIComponent(q)}`);
    setList(res.data);
  };

  useEffect(() => { load(); }, []);

  const updatePatient = async (id, patch) => {
    await api.put(`/api/patients/${id}`, patch);
    load();
  };

  return (
    <>
      <h2>Patient Management</h2>

      <div className="card">
        <div className="row">
          <input className="input" style={{ flex: 1 }} placeholder="Search name or email" value={q} onChange={(e) => setQ(e.target.value)} />
          <button className="btn btn-primary" onClick={load}>Search</button>
        </div>
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th><th>Email</th><th>Phone</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map(p => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.email}</td>
                <td>{p.phone || "-"}</td>
                <td><span className="badge">{p.status}</span></td>
                <td>
                  <button className="btn" onClick={() => {
                    const phone = prompt("Update phone:", p.phone || "");
                    if (phone === null) return;
                    updatePatient(p._id, { phone });
                  }}>Edit Phone</button>{" "}

                  <button className="btn" onClick={() => {
                    const next = p.status === "Active" ? "Inactive" : "Active";
                    updatePatient(p._id, { status: next });
                  }}>
                    Set {p.status === "Active" ? "Inactive" : "Active"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
