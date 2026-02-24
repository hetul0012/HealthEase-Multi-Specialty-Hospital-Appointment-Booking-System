import { useEffect, useState } from "react";
import api from "../api/api";

export default function MyAppointments() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/appointments/mine");
      setItems(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const cancel = async (id) => {
    await api.patch(`/appointments/${id}/cancel`);
    load();
  };

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;

  return (
    <div style={{ padding: 24 }}>
      <h1>My Appointments</h1>

      {items.length === 0 ? (
        <div>No appointments yet. Go to <b>Find Doctors</b> and book one.</div>
      ) : (
        <table cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left" }}>
              <th>Doctor</th>
              <th>Department</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((a) => (
              <tr key={a._id} style={{ borderTop: "1px solid #eee" }}>
                <td>{a.doctor?.name}</td>
                <td>{a.doctor?.department?.name || "-"}</td>
                <td>{a.date}</td>
                <td>{a.time}</td>
                <td>{a.status}</td>
                <td>
                  {a.status === "Booked" && (
                    <button onClick={() => cancel(a._id)}>Cancel</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}