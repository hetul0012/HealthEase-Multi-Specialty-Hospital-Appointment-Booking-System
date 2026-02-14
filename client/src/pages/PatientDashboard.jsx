import { useEffect, useState } from "react";
import api from "../api/api";

export default function PatientDashboard() {
  const [appts, setAppts] = useState([]);

  useEffect(() => {
    api.get("/api/appointments/mine").then(r => setAppts(r.data));
  }, []);

  const total = appts.length;
  const upcoming = appts.filter(a => a.status === "Confirmed" || a.status === "Pending").length;

  return (
    <div className="container">
      <div className="row" style={{ alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>Patient Portal</h2>
        <a className="btn btn-primary" href="/find-doctors">Book Appointment</a>
      </div>

      <div className="grid grid-3" style={{ marginTop: 12 }}>
        <div className="card"><h3>Total Appointments</h3><p style={{ fontSize: 26 }}>{total}</p></div>
        <div className="card"><h3>Upcoming</h3><p style={{ fontSize: 26 }}>{upcoming}</p></div>
        <div className="card"><h3>Health Score</h3><p style={{ fontSize: 26 }}>85</p></div>
      </div>

      <h3 style={{ marginTop: 16 }}>Upcoming Appointments</h3>
      <div className="grid">
        {appts.slice(0, 3).map(a => (
          <div key={a._id} className="card">
            <div className="row" style={{ justifyContent: "space-between" }}>
              <div>
                <b>{a.doctor?.name}</b>
                <div style={{ color: "var(--muted)" }}>{a.department?.name} • {a.type}</div>
              </div>
              <span className="badge">{a.status}</span>
            </div>
            <div style={{ marginTop: 8 }}><b>{a.date}</b> • {a.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
