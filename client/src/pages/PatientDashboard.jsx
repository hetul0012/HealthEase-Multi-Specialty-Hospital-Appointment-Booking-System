import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

function formatDate(d) {
  if (!d) return "—";
  try {
    const dt = new Date(d);
    return dt.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
  } catch {
    return "—";
  }
}

function safeLower(s) {
  return (s || "").toString().toLowerCase();
}

export default function PatientDashboard() {
  const nav = useNavigate();
  const { user, logout } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setErr("");

      try {
        // try mine first
        const res = await api.get("/appointments/mine");
        if (!mounted) return;
        setAppointments(Array.isArray(res.data) ? res.data : []);
      } catch (e1) {
        try {
          // fallback
          const res2 = await api.get("/appointments");
          if (!mounted) return;
          setAppointments(Array.isArray(res2.data) ? res2.data : []);
        } catch (e2) {
          if (!mounted) return;
          setAppointments([]);
          setErr(e2?.response?.data?.message || "Failed to load appointments.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => (mounted = false);
  }, []);

  const firstName = useMemo(() => {
    const nm = user?.name || user?.fullName || "Patient";
    return nm.split(" ")[0] || "Patient";
  }, [user]);

  const stats = useMemo(() => {
    const total = appointments.length;

    const doctors = new Set(
      appointments
        .map((a) => a?.doctor?.name || a?.doctorName || a?.doctor)
        .filter(Boolean)
        .map(String)
    );

    const upcomingCount = appointments.filter((a) => {
      const d = new Date(a?.date || a?.appointmentDate || 0).getTime();
      return d >= Date.now();
    }).length;

    return {
      totalAppointments: total,
      upcomingAppointments: upcomingCount,
      myDoctors: doctors.size,
      healthScore: 85, // demo
    };
  }, [appointments]);

  const upcoming = useMemo(() => {
    const list = [...appointments];
    list.sort((a, b) => {
      const ad = new Date(a?.date || a?.appointmentDate || 0).getTime();
      const bd = new Date(b?.date || b?.appointmentDate || 0).getTime();
      return ad - bd;
    });
    return list.slice(0, 3);
  }, [appointments]);

  return (
    <div className="page">
      <div className="container" style={{ padding: "22px 18px" }}>
        <div className="pd-simple">
          {/* SIDEBAR */}
          <aside className="pdS-side">
            <div className="pdS-brand" onClick={() => nav("/patient")} style={{ cursor: "pointer" }}>
              <span className="pdS-logo">
                <i className="fa-solid fa-heart-pulse"></i>
              </span>
              <div>
                <div className="pdS-name">HealthEase</div>
                <div className="pdS-sub">Patient Portal</div>
              </div>
            </div>

            <div className="pdS-nav">
              <button className="pdS-link active" onClick={() => nav("/patient")}>
                <i className="fa-solid fa-table-columns"></i>
                Dashboard
              </button>

              <button className="pdS-link" onClick={() => nav("/appointments")}>
                <i className="fa-regular fa-calendar"></i>
                Appointments
              </button>

              <button className="pdS-link" onClick={() => nav("/find-doctors")}>
                <i className="fa-solid fa-user-doctor"></i>
                Find Doctors
              </button>

              <button className="pdS-link" onClick={() => nav("/patient/profile")}>
                <i className="fa-regular fa-user"></i>
                My Profile
              </button>
            </div>

            <button
              className="pdS-logout"
              onClick={() => {
                logout();
                nav("/");
              }}
            >
              <i className="fa-solid fa-right-from-bracket"></i>
              Logout
            </button>
          </aside>

          {/* MAIN */}
          <main className="pdS-main">
            {/* TOP HEADER */}
            <div className="pdS-top">
              <div>
                <h2 className="pdS-title">Welcome, {firstName}</h2>
                <p className="pdS-muted">Here’s a quick overview of your account.</p>
              </div>

              <div className="pdS-topRight">
                <button className="btn btn-primary" onClick={() => nav("/find-doctors")}>
                  <i className="fa-solid fa-plus"></i>&nbsp; Book Appointment
                </button>

                <div className="pdS-avatar" title="Profile" onClick={() => nav("/patient/profile")}>
                  {firstName?.[0]?.toUpperCase() || "P"}
                </div>
              </div>
            </div>

            {/* STATS */}
            <div className="pdS-stats">
              <div className="pdS-card">
                <div className="pdS-cardTop">
                  <div>
                    <div className="pdS-cardLabel">Total Appointments</div>
                    <div className="pdS-cardValue">{stats.totalAppointments}</div>
                  </div>
                  <div className="pdS-icon blue">
                    <i className="fa-regular fa-calendar-check"></i>
                  </div>
                </div>
              </div>

              <div className="pdS-card">
                <div className="pdS-cardTop">
                  <div>
                    <div className="pdS-cardLabel">Upcoming</div>
                    <div className="pdS-cardValue">{stats.upcomingAppointments}</div>
                  </div>
                  <div className="pdS-icon green">
                    <i className="fa-regular fa-clock"></i>
                  </div>
                </div>
              </div>

              <div className="pdS-card">
                <div className="pdS-cardTop">
                  <div>
                    <div className="pdS-cardLabel">My Doctors</div>
                    <div className="pdS-cardValue">{stats.myDoctors}</div>
                  </div>
                  <div className="pdS-icon orange">
                    <i className="fa-solid fa-user-doctor"></i>
                  </div>
                </div>
              </div>

              <div className="pdS-card">
                <div className="pdS-cardTop">
                  <div>
                    <div className="pdS-cardLabel">Health Score</div>
                    <div className="pdS-cardValue">{stats.healthScore}</div>
                  </div>
                  <div className="pdS-icon purple">
                    <i className="fa-solid fa-heart"></i>
                  </div>
                </div>
                <div className="pdS-small">Demo value</div>
              </div>
            </div>

            {/* CONTENT GRID */}
            <div className="pdS-grid">
              {/* UPCOMING */}
              <section className="pdS-panel">
                <div className="pdS-panelHead">
                  <h3>Upcoming Appointments</h3>
                  <Link to="/appointments" className="pdS-linkSmall">
                    View All <i className="fa-solid fa-arrow-right"></i>
                  </Link>
                </div>

                {loading && <div className="pdS-muted">Loading...</div>}
                {!loading && err && <div className="pdS-error">{err}</div>}

                {!loading && !err && upcoming.length === 0 && (
                  <div className="pdS-muted">
                    No appointments yet. Go to <b>Find Doctors</b> and book one.
                  </div>
                )}

                {!loading && !err && upcoming.length > 0 && (
                  <div className="pdS-list">
                    {upcoming.map((a) => {
                      const doctorName = a?.doctor?.name || a?.doctorName || "Doctor";
                      const deptName = a?.doctor?.department?.name || a?.department?.name || "Department";
                      const dateText = formatDate(a?.date || a?.appointmentDate);
                      const timeText = a?.time || "—";
                      const status = a?.status || "Booked";

                      const cancelled = safeLower(status).includes("cancel");

                      return (
                        <div className="pdS-item" key={a?._id || `${doctorName}-${dateText}-${timeText}`}>
                          <div className="pdS-itemLeft">
                            <div className="pdS-itemIcon">
                              <i className="fa-solid fa-stethoscope"></i>
                            </div>
                            <div>
                              <div className="pdS-itemTitle">{doctorName}</div>
                              <div className="pdS-itemSub">{deptName}</div>
                            </div>
                          </div>

                          <div className="pdS-itemRight">
                            <div className="pdS-itemDate">{dateText}</div>
                            <div className="pdS-itemTime">{timeText}</div>
                            <span className={`pdS-badge ${cancelled ? "cancel" : "ok"}`}>{status}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>

              {/* QUICK ACTIONS */}
              <section className="pdS-panel">
                <div className="pdS-panelHead">
                  <h3>Quick Actions</h3>
                </div>

                <div className="pdS-actions">
                  <button className="pdS-actionBtn" onClick={() => nav("/find-doctors")}>
                    <i className="fa-regular fa-calendar-plus"></i>
                    Schedule Appointment
                  </button>

                  <button className="pdS-actionBtn" onClick={() => nav("/patient/profile")}>
                    <i className="fa-regular fa-user"></i>
                    Update Profile
                  </button>

                  <button className="pdS-actionBtn" onClick={() => nav("/appointments")}>
                    <i className="fa-solid fa-list-check"></i>
                    Manage Appointments
                  </button>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}