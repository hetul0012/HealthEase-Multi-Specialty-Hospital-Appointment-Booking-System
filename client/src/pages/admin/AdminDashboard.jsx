import { useEffect, useMemo, useState } from "react";
import api from "../../api/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
  });

  
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setErr("");

      try {
      

        const [docRes, patientRes, apptRes] = await Promise.allSettled([
          api.get("/doctors"),
          api.get("/admin/patients"),       
          api.get("/appointments"),         
        ]);

        const doctors = docRes.status === "fulfilled" ? docRes.value.data : [];
        const patients = patientRes.status === "fulfilled" ? patientRes.value.data : [];
        const appointments = apptRes.status === "fulfilled" ? apptRes.value.data : [];

        if (!mounted) return;

        const apptsArray = Array.isArray(appointments) ? appointments : [];
        const recent = apptsArray.slice(-5).reverse();

        setStats({
          totalDoctors: Array.isArray(doctors) ? doctors.length : 0,
          totalPatients: Array.isArray(patients) ? patients.length : 0,
          totalAppointments: apptsArray.length,
        });

      
        setRecentBookings(Array.isArray(recent) ? recent : []);
      } catch (e) {
        if (!mounted) return;
        setErr(e?.response?.data?.message || "Failed to load admin dashboard data.");
        setRecentBookings([]); 
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const safeRecent = useMemo(
    () => (Array.isArray(recentBookings) ? recentBookings : []),
    [recentBookings]
  );

  return (
    <div className="page">
      <div className="container" style={{ padding: "22px 18px" }}>
        <div className="card" style={{ padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ margin: 0 }}>Dashboard Overview</h2>
            <div style={{ color: "#64748b", display: "flex", alignItems: "center", gap: 8 }}>
              <i className="fa-regular fa-circle-user"></i> Admin
            </div>
          </div>

          {loading && <p style={{ color: "#64748b", marginTop: 14 }}>Loading...</p>}
          {err && (
            <div style={{ marginTop: 14, background: "#fff1f2", color: "#991b1b", padding: 12, borderRadius: 12 }}>
              {err}
            </div>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 14,
              marginTop: 16,
            }}
          >
            <StatCard label="Total Doctors" value={stats.totalDoctors} icon="fa-user-doctor" tone="blue" />
            <StatCard label="Total Patients" value={stats.totalPatients} icon="fa-users" tone="green" />
            <StatCard label="Appointments" value={stats.totalAppointments} icon="fa-calendar-check" tone="purple" />
          </div>

          <div className="card" style={{ marginTop: 16, padding: 16 }}>
            <h3 style={{ margin: 0 }}>Recent Bookings</h3>

            {!loading && safeRecent.length === 0 && (
              <p style={{ marginTop: 10, color: "#64748b" }}>No bookings yet.</p>
            )}

            {safeRecent.map((a, idx) => {
              const patient = a?.patient?.name || a?.patientName || "Patient";
              const doctor = a?.doctor?.name || a?.doctorName || "Doctor";
              const status = a?.status || "Booked";

              return (
                <div
                  key={a?._id || idx}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px 0",
                    borderBottom: "1px solid #eef2f7",
                    marginTop: 6,
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700 }}>{patient}</div>
                    <div style={{ color: "#64748b", fontSize: 13 }}>{doctor}</div>
                  </div>
                  <div style={{ color: "#334155", fontSize: 13 }}>{status}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, tone }) {
  const toneBg =
    tone === "green" ? "#e9fff2" : tone === "purple" ? "#f2ecff" : "#e8f0ff";
  const toneColor =
    tone === "green" ? "#16a34a" : tone === "purple" ? "#7c3aed" : "#2563eb";

  return (
    <div className="card" style={{ padding: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ color: "#64748b", fontWeight: 700, fontSize: 13 }}>{label}</div>
        <div style={{ width: 34, height: 34, borderRadius: 12, display: "grid", placeItems: "center", background: toneBg, color: toneColor }}>
          <i className={`fa-solid ${icon}`}></i>
        </div>
      </div>
      <div style={{ fontSize: 30, fontWeight: 800, marginTop: 8 }}>{value}</div>
    </div>
  );
}