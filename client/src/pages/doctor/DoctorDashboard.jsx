import { useEffect, useState } from "react";
import api from "../../api/api";

export default function DoctorDashboard() {
  const [list, setList] = useState([]);
  const [msg, setMsg] = useState("");

  const load = async () => {
    const res = await api.get("/api/doctor/appointments");
    setList(res.data);
  };

  useEffect(() => { load(); }, []);

  const update = async (id, patch) => {
    setMsg("");
    try {
      await api.put(`/api/doctor/appointments/${id}`, patch);
      setMsg("✅ Updated");
      load();
    } catch (e) {
      setMsg(e.response?.data?.message || "Update failed");
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this appointment?")) return;
    await api.delete(`/api/doctor/appointments/${id}`);
    load();
  };

  const reschedule = async (id, currentDate, currentTime) => {
    const date = prompt("New date (YYYY-MM-DD):", currentDate);
    if (!date) return;
    const time = prompt("New time (ex: 10:30 AM):", currentTime);
    if (!time) return;
    update(id, { date, time });
  };

  return (
    <div className="container">
      <h2>Doctor Dashboard</h2>
      {msg && <p style={{ color: msg.includes("✅") ? "green" : "red" }}>{msg}</p>}

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Patient</th><th>Email</th><th>Phone</th>
              <th>Date</th><th>Time</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map(a => (
              <tr key={a._id}>
                <td>{a.patient?.name}</td>
                <td>{a.patient?.email}</td>
                <td>{a.patient?.phone || "-"}</td>
                <td>{a.date}</td>
                <td>{a.time}</td>
                <td><span className="badge">{a.status}</span></td>
                <td>
                  <button className="btn" onClick={() => update(a._id, { status: "Confirmed" })}>Confirm</button>{" "}
                  <button className="btn" onClick={() => update(a._id, { status: "Completed" })}>Complete</button>{" "}
                  <button className="btn" onClick={() => update(a._id, { status: "Cancelled" })}>Cancel</button>{" "}
                  <button className="btn" onClick={() => reschedule(a._id, a.date, a.time)}>Reschedule</button>{" "}
                  <button className="btn" onClick={() => remove(a._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
