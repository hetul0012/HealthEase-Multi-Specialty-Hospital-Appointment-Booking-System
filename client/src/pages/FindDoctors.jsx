import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/api";

export default function FindDoctors() {
  const [params, setParams] = useSearchParams();
  const departmentId = params.get("departmentId") || "";
  const [q, setQ] = useState(params.get("q") || "");
  const [depts, setDepts] = useState([]);
  const [docs, setDocs] = useState([]);

  const load = async () => {
    const [d1, d2] = await Promise.all([
      api.get("/api/departments"),
      api.get(`/api/doctors?departmentId=${departmentId}&q=${q}`)
    ]);
    setDepts(d1.data);
    setDocs(d2.data);
  };

  useEffect(() => { load(); }, [departmentId]);

  return (
    <div className="container">
      <h2>Find Your Doctor</h2>

      <div className="card">
        <div className="row">
          <input className="input" style={{ flex: 1 }} placeholder="Search by name..." value={q} onChange={(e) => setQ(e.target.value)} />
          <select className="input" value={departmentId} onChange={(e) => setParams({ departmentId: e.target.value, q })}>
            <option value="">All Departments</option>
            {depts.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
          </select>
          <button className="btn btn-primary" onClick={() => load()}>Search</button>
        </div>
      </div>

      <div className="grid grid-3" style={{ marginTop: 14 }}>
        {docs.map(doc => (
          <div className="card" key={doc._id}>
            <h3 style={{ marginTop: 0 }}>{doc.name}</h3>
            <p style={{ margin: "6px 0", color: "var(--muted)" }}>{doc.specialization}</p>
            <p style={{ margin: "6px 0" }}><span className="badge">{doc.availableStatus}</span></p>
            <p style={{ color: "var(--muted)" }}>{doc.location}</p>
            <p><b>Next:</b> {doc.nextSlot}</p>
            <a className="btn btn-primary" href={`/doctor/${doc._id}`}>View Profile</a>
          </div>
        ))}
      </div>
    </div>
  );
}
