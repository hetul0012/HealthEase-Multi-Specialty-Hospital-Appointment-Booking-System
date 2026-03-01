import { useEffect, useMemo, useState } from "react";
import api from "../../api/api";

const STATUS_OPTIONS = ["Booked", "Confirmed", "Completed", "Cancelled", "Rescheduled"];

export default function DoctorAppointments() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [savingId, setSavingId] = useState("");

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const res = await api.get("/doctor/appointments", { params: { q, status } });
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load appointments.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, []);

  const filtered = useMemo(() => items, [items]);

  const updateStatus = async (id, nextStatus) => {
    try {
      setSavingId(id);
      const res = await api.patch(`/doctor/appointments/${id}`, { status: nextStatus });
      const updated = res.data;
      setItems((prev) => prev.map((x) => (x._id === id ? updated : x)));
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to update status.");
    } finally {
      setSavingId("");
    }
  };

  return (
    <div className="ad-content">
      <div className="ad-headRow">
        <div>
          <h2 className="ad-title">Appointments</h2>
          <div className="ad-subtitle">Manage your patient appointments</div>
        </div>

        <button className="ad-btn" onClick={load}>
          <i className="fa-solid fa-rotate-right"></i> Refresh
        </button>
      </div>

      <div className="ad-card" style={{ marginTop: 14 }}>
        <div className="ad-filters">
          <div className="ad-inputWrap">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search patient name/email..." />
          </div>

          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All Status</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <button className="ad-btnPrimary" onClick={load}>
            <i className="fa-solid fa-filter"></i> Apply
          </button>
        </div>

        {loading && <div className="ad-muted">Loading...</div>}
        {!loading && err && <div className="ad-error">{err}</div>}

        {!loading && !err && filtered.length === 0 && <div className="ad-muted">No appointments found.</div>}

        {!loading && !err && filtered.length > 0 && (
          <div className="ad-tableWrap">
            <table className="ad-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Email</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th style={{ width: 220 }}>Update</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => (
                  <tr key={a._id}>
                    <td>{a?.patient?.name || "Patient"}</td>
                    <td>{a?.patient?.email || "-"}</td>
                    <td>{a?.date ? new Date(a.date).toLocaleDateString() : "-"}</td>
                    <td>{a?.time || "-"}</td>
                    <td>{a?.status || "Booked"}</td>
                    <td>
                      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        <select
                          value={a?.status || "Booked"}
                          onChange={(e) => updateStatus(a._id, e.target.value)}
                          disabled={savingId === a._id}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>

                        {savingId === a._id && <span style={{ fontSize: 12, color: "#64748b" }}>Saving...</span>}
                      </div>
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