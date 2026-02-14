import { useEffect, useState } from "react";
import api from "../../api/api";

export default function AdminDashboard() {
  const [s, setS] = useState(null);
  useEffect(() => { api.get("/api/admin/stats").then(r => setS(r.data)); }, []);

  if (!s) return <p>Loading...</p>;

  return (
    <>
      <h2>Dashboard Overview</h2>
      <div className="grid grid-3">
        <div className="card"><h3>Total Doctors</h3><p style={{ fontSize: 26 }}>{s.doctors}</p></div>
        <div className="card"><h3>Total Patients</h3><p style={{ fontSize: 26 }}>{s.patients}</p></div>
        <div className="card"><h3>Today’s Appointments</h3><p style={{ fontSize: 26 }}>{s.todays}</p></div>
      </div>
    </>
  );
}
