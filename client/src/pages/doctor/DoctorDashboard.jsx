import { useEffect, useMemo, useState } from "react";
import api from "../../api/api";

function safeLower(s) {
  return (s || "").toString().toLowerCase();
}

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setErr("");
      try {
        const res = await api.get("/doctor/appointments");
        if (!mounted) return;
        setAppointments(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        if (!mounted) return;
        setErr(e?.response?.data?.message || "Failed to load doctor dashboard.");
        setAppointments([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    const total = appointments.length;
    const upcoming = appointments.filter((a) => !safeLower(a?.status).includes("cancel") && !safeLower(a?.status).includes("complete")).length;
    const completed = appointments.filter((a) => safeLower(a?.status).includes("complete")).length;
    return { total, upcoming, completed };
  }, [appointments]);

  const recent = useMemo(() => appointments.slice(0, 5), [appointments]);

  return (
    <div className="ad-content">
      <div className="ad-head">
        <h2 className="ad-title">Dashboard Overview</h2>
        <div className="ad-subtitle">Quick summary of your appointments</div>
      </div>

      {loading && <div className="ad-muted">Loading...</div>}
      {!loading && err && <div className="ad-error">{err}</div>}

      {!loading && !err && (
        <>
          <div className="ad-stats">
            <div className="ad-statCard">
              <div className="ad-statLabel">Total Appointments</div>
              <div className="ad-statValue">{stats.total}</div>
              <div className="ad-statIcon blue">
                <i className="fa-regular fa-calendar"></i>
              </div>
            </div>

            <div className="ad-statCard">
              <div className="ad-statLabel">Upcoming</div>
              <div className="ad-statValue">{stats.upcoming}</div>
              <div className="ad-statIcon green">
                <i className="fa-regular fa-clock"></i>
              </div>
            </div>

            <div className="ad-statCard">
              <div className="ad-statLabel">Completed</div>
              <div className="ad-statValue">{stats.completed}</div>
              <div className="ad-statIcon purple">
                <i className="fa-regular fa-circle-check"></i>
              </div>
            </div>
          </div>

          <div className="ad-card" style={{ marginTop: 16 }}>
            <div className="ad-cardHead">
              <div className="ad-cardTitle">Recent Appointments</div>
            </div>

            {recent.length === 0 ? (
              <div className="ad-muted">No appointments yet.</div>
            ) : (
              <div className="ad-tableWrap">
                <table className="ad-table">
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Email</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map((a) => (
                      <tr key={a._id}>
                        <td>{a?.patient?.name || "Patient"}</td>
                        <td>{a?.patient?.email || "-"}</td>
                        <td>{a?.date ? new Date(a.date).toLocaleDateString() : "-"}</td>
                        <td>{a?.time || "-"}</td>
                        <td>{a?.status || "Booked"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}