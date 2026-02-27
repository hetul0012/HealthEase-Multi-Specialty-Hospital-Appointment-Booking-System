import { useEffect, useState } from "react";
import api from "../../api/api";

export default function AdminAppointments() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const r = await api.get(
        `/admin/appointments?q=${encodeURIComponent(q)}&status=${encodeURIComponent(status)}`
      );
      setItems(r.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
   
  }, []);

  const updateStatus = async (id, next) => {
    await api.patch(`/admin/appointments/${id}`, { status: next });
    load();
  };

  const onDelete = async (id) => {
    if (!window.confirm("Delete this appointment?")) return;
    await api.delete(`/admin/appointments/${id}`);
    load();
  };

  return (
    <div>
      <div className="ad-pageHead">
        <div>
          <div className="ad-h1">Appointments</div>
          <div className="ad-sub">View and manage bookings.</div>
        </div>
      </div>

      <div className="ad-filters">
        <div className="ad-input">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input placeholder="Search patient/doctor..." value={q} onChange={(e) => setQ(e.target.value)} />
        </div>

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="Booked">Booked</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Completed">Completed</option>
        </select>

        <button className="ad-btn" onClick={load}>
          <i className="fa-solid fa-filter"></i> Apply
        </button>
      </div>

      <div className="ad-panel">
        {loading ? (
          <div className="ad-muted">Loading...</div>
        ) : items.length === 0 ? (
          <div className="ad-muted">No appointments found.</div>
        ) : (
          <div className="ad-tableWrap">
            <table className="ad-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Department</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th style={{ width: 170 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((a) => (
                  <tr key={a._id}>
                    <td>{a.patient?.name || "—"}</td>
                    <td>{a.doctor?.name || "—"}</td>
                    <td>{a.department?.name || "—"}</td>
                    <td>{String(a.date || "").slice(0, 10) || "—"}</td>
                    <td>{a.time || "—"}</td>
                    <td>
                      <span className={`ad-pill ${String(a.status).toLowerCase().includes("cancel") ? "warn" : "ok"}`}>
                        {a.status || "Booked"}
                      </span>
                    </td>
                    <td className="ad-actionsTd">
                      <button className="ad-btnTiny" onClick={() => updateStatus(a._id, "Booked")}>Booked</button>
                      <button className="ad-btnTiny" onClick={() => updateStatus(a._id, "Cancelled")}>Cancel</button>
                      <button className="ad-iconBtn danger" onClick={() => onDelete(a._id)} title="Delete">
                        <i className="fa-regular fa-trash-can"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}