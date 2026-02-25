import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

function formatDate(d) {
  if (!d) return "";
  try {
    const dt = new Date(d);
    return dt.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
  } catch {
    return String(d);
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
        const res = await api.get("/appointments/mine");
        if (!mounted) return;
        setAppointments(Array.isArray(res.data) ? res.data : []);
      } catch (e1) {
        try {
          const res2 = await api.get("/appointments");
          if (!mounted) return;
          setAppointments(Array.isArray(res2.data) ? res2.data : []);
        } catch (e2) {
          if (!mounted) return;
          setAppointments([]);
          setErr(e2?.response?.data?.message || "Failed to load dashboard data.");
        }
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
    const totalAppointments = appointments.length;

    const doctorsSet = new Set(
      appointments
        .map((a) => a?.doctor?.name || a?.doctorName || a?.doctor)
        .filter(Boolean)
        .map((x) => x.toString())
    );

    return {
      totalAppointments,
      myDoctors: doctorsSet.size,
      activePrescriptions: 3,
      healthScore: 85,
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

  const recentActivity = useMemo(() => {
    const list = [...appointments].slice(-4).reverse();

    return list.map((a) => {
      const status = a?.status || "Booked";
      const doctor = a?.doctor?.name || "Doctor";
      const dept = a?.doctor?.department?.name || a?.department?.name || "Department";
      const dateText = formatDate(a?.date);

      let label = "Appointment booked";
      if (safeLower(status).includes("cancel")) label = "Appointment cancelled";
      if (safeLower(status).includes("complete")) label = "Appointment completed";

      return {
        title: label,
        sub: `${doctor} • ${dept}`,
        time: dateText || "Recently",
      };
    });
  }, [appointments]);

  const firstName = useMemo(() => {
    const nm = user?.name || user?.fullName || "Patient";
    return nm.split(" ")[0] || "Patient";
  }, [user]);

  return (
    <div className="page">
      <div className="container" style={{ padding: "22px 18px" }}>
        <div className="pd-shell">
          <aside className="pd-sidebar">
            <div className="pd-brand">
              <div className="pd-logo">
                <i className="fa-solid fa-heart-pulse"></i>
              </div>
              <div>
                <div className="pd-brandName">HealthEase</div>
                <div className="pd-subText">Patient Portal</div>
              </div>
            </div>

            <nav className="pd-nav">
              <button className="pd-navItem active" type="button" onClick={() => nav("/patient")}>
                <i className="fa-solid fa-table-columns"></i>
                <span>Dashboard</span>
              </button>

              <button className="pd-navItem" type="button" onClick={() => nav("/appointments")}>
                <i className="fa-regular fa-calendar"></i>
                <span>Appointments</span>
              </button>

              <button className="pd-navItem" type="button" onClick={() => nav("/find-doctors")}>
                <i className="fa-solid fa-user-doctor"></i>
                <span>My Doctors</span>
              </button>

              <button className="pd-navItem" type="button" onClick={() => alert("Medical Records (coming soon)")}>
                <i className="fa-regular fa-folder-open"></i>
                <span>Medical Records</span>
              </button>

              <button className="pd-navItem" type="button" onClick={() => alert("Prescriptions (coming soon)")}>
                <i className="fa-solid fa-pills"></i>
                <span>Prescriptions</span>
              </button>

              <button className="pd-navItem" type="button" onClick={() => alert("Health Metrics (coming soon)")}>
                <i className="fa-solid fa-chart-line"></i>
                <span>Health Metrics</span>
              </button>

              <button className="pd-navItem" type="button" onClick={() => alert("Billing (coming soon)")}>
                <i className="fa-regular fa-credit-card"></i>
                <span>Billing</span>
              </button>
            </nav>

            <div className="pd-sidebarBottom">
              <button
                className="pd-logout"
                type="button"
                onClick={() => {
                  logout();
                  nav("/");
                }}
              >
                <i className="fa-solid fa-right-from-bracket"></i>
                <span>Logout</span>
              </button>
            </div>
          </aside>

          <main className="pd-main">
            <div className="pd-header">
              <div>
                <h2 className="pd-title">Welcome back, {firstName}</h2>
                <div className="pd-subTitle">Here’s your health overview for today</div>
              </div>

              <div className="pd-headerActions">
                <button className="pd-primaryBtn" onClick={() => nav("/find-doctors")}>
                  <i className="fa-solid fa-plus"></i> Book Appointment
                </button>

                <button className="pd-iconBtn" onClick={() => alert("Notifications (coming soon)")}>
                  <i className="fa-regular fa-bell"></i>
                </button>

                  <div className="pd-avatar" title="View Profile" onClick={() => nav("/patient/profile")} style={{ cursor: "pointer" }} >
                  {firstName?.[0]?.toUpperCase() || "P"}
                  </div>
                
              </div>
            </div>

            <div className="pd-stats">
              <div className="pd-statCard">
                <div className="pd-statTop">
                  <div className="pd-statLabel">Total Appointments</div>
                  <div className="pd-statIcon blue">
                    <i className="fa-regular fa-calendar-check"></i>
                  </div>
                </div>
                <div className="pd-statValue">{stats.totalAppointments}</div>
                <div className="pd-statHint">+2 this month</div>
              </div>

              <div className="pd-statCard">
                <div className="pd-statTop">
                  <div className="pd-statLabel">My Doctors</div>
                  <div className="pd-statIcon green">
                    <i className="fa-solid fa-user-doctor"></i>
                  </div>
                </div>
                <div className="pd-statValue">{stats.myDoctors}</div>
                <div className="pd-statHint">Active providers</div>
              </div>

              <div className="pd-statCard">
                <div className="pd-statTop">
                  <div className="pd-statLabel">Active Prescriptions</div>
                  <div className="pd-statIcon orange">
                    <i className="fa-solid fa-pills"></i>
                  </div>
                </div>
                <div className="pd-statValue">{stats.activePrescriptions}</div>
                <div className="pd-statHint">Refills needed</div>
              </div>

              <div className="pd-statCard">
                <div className="pd-statTop">
                  <div className="pd-statLabel">Health Score</div>
                  <div className="pd-statIcon purple">
                    <i className="fa-solid fa-heart"></i>
                  </div>
                </div>
                <div className="pd-statValue">{stats.healthScore}</div>
                <div className="pd-statHint">Excellent</div>
              </div>
            </div>

            <div className="pd-grid">
              <section className="pd-card pd-upcoming">
                <div className="pd-cardHead">
                  <div className="pd-cardTitle">Upcoming Appointments</div>
                  <Link className="pd-linkBtn" to="/appointments">
                    View All <i className="fa-solid fa-arrow-right"></i>
                  </Link>
                </div>

                {loading && <div className="pd-muted">Loading...</div>}
                {!loading && err && <div className="pd-error">{err}</div>}

                {!loading && !err && upcoming.length === 0 && (
                  <div className="pd-muted">
                    No appointments yet. Go to <b>Find Doctors</b> and book one.
                  </div>
                )}

                {!loading && !err && upcoming.length > 0 && (
                  <div className="pd-list">
                    {upcoming.map((a) => {
                      const doctorName = a?.doctor?.name || a?.doctorName || "Doctor";
                      const deptName = a?.doctor?.department?.name || a?.department?.name || "Department";
                      const dateText = formatDate(a?.date);
                      const timeText = a?.time || "—";
                      const status = a?.status || "Booked";

                      return (
                        <div className="pd-item" key={a?._id || `${doctorName}-${dateText}-${timeText}`}>
                          <div className="pd-itemIcon">
                            <i className="fa-solid fa-stethoscope"></i>
                          </div>

                          <div className="pd-itemMain">
                            <div className="pd-itemTop">
                              <div className="pd-itemTitle">{doctorName}</div>
                              <div className={`pd-badge ${safeLower(status).includes("cancel") ? "cancel" : "ok"}`}>
                                {status}
                              </div>
                            </div>
                            <div className="pd-itemSub">{deptName}</div>
                          </div>

                          <div className="pd-itemRight">
                            <div className="pd-itemDate">{dateText || "—"}</div>
                            <div className="pd-itemTime">{timeText}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>

              <section className="pd-side">
                <div className="pd-card">
                  <div className="pd-cardHead">
                    <div className="pd-cardTitle">Quick Actions</div>
                  </div>

                  <div className="pd-actions">
                    <button className="pd-actionBtn" onClick={() => nav("/find-doctors")}>
                      <i className="fa-regular fa-calendar-plus"></i>
                      <span>Schedule Appointment</span>
                    </button>
                    <button className="pd-actionBtn" onClick={() => nav("/appointments")}>
                      <i className="fa-solid fa-user-gear"></i>
                      <span>Manage Doctor</span>
                    </button>
                    <button className="pd-actionBtn" onClick={() => alert("Downloading records...")}>
                      <i className="fa-solid fa-download"></i>
                      <span>Download Records</span>
                    </button>
                    <button className="pd-actionBtn" onClick={() => alert("Refill request sent!")}>
                      <i className="fa-solid fa-prescription-bottle-medical"></i>
                      <span>Refill Prescription</span>
                    </button>
                  </div>
                </div>

                <div className="pd-card" style={{ marginTop: 14 }}>
                  <div className="pd-cardHead">
                    <div className="pd-cardTitle">Recent Activity</div>
                  </div>

                  {loading && <div className="pd-muted">Loading...</div>}

                  {!loading && recentActivity.length === 0 && <div className="pd-muted">No recent activity yet.</div>}

                  {!loading && recentActivity.length > 0 && (
                    <div className="pd-activity">
                      {recentActivity.map((it, idx) => (
                        <div className="pd-activityItem" key={idx}>
                          <div className="pd-dot"></div>
                          <div>
                            <div className="pd-activityTitle">{it.title}</div>
                            <div className="pd-activitySub">{it.sub}</div>
                          </div>
                          <div className="pd-activityTime">{it.time}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}