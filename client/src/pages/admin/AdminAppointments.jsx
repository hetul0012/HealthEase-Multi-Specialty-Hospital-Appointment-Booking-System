import { useEffect, useState } from "react";
import api from "../../api/api";

export default function AdminAppointments() {
  const [list, setList] = useState([]);

  const load = async () => {
    const res = await api.get("/api/appointments/all");
    setList(res.data);
  };

  useEffect(() => { load(); }, []);

  const setStatus = async (id, status) => {
    await api.put(`/api/appointments/${id}/status`, { status });
    load();
  };

  const deleteAppt = async (id) => {
    // Admin delete not in your backend now; easiest is status Cancelled
    // If you want true delete, tell me and I’ll add backend route.
    if (!confirm("Cancel this appointment?")) return;
    await api.put(`/api/appointments/${id}/status`, { status: "Cancelled" });
    load();
  };

  return (
    <>
      <h2>Appointment Management</h2>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Patient</th><th>Doctor</th><th>Department</th>
              <th>Date</th><th>Time</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map(a => (
              <tr key={a._id}>
                <td>{a.patient?.name}</td>
                <td>{a.doctor?.name}</td>
                <td>{a.department?.name}</td>
                <td>{a.date}</td>
                <td>{a.time}</td>
                <td><span className="badge">{a.status}</span></td>
                <td>
                  <button className="btn" onClick={() => setStatus(a._id, "Pending")}>Pending</button>{" "}
                  <button className="btn" onClick={() => setStatus(a._id, "Confirmed")}>Confirm</button>{" "}
                  <button className="btn" onClick={() => setStatus(a._id, "Completed")}>Complete</button>{" "}
                  <button className="btn" onClick={() => deleteAppt(a._id)}>Cancel</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
