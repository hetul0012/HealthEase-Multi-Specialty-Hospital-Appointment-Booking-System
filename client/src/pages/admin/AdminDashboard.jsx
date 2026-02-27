import { useEffect, useState } from "react";
import api from "../../api/api";

export default function AdminDashboard() {
  const [data, setData] = useState({ totalDoctors: 0, totalPatients: 0, totalAppointments: 0, recentBookings: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/admin/stats")
      .then((r) => setData(r.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="ad-cards">
        <div className="ad-card">
          <div className="ad-cardTop">
            <div>
              <div className="ad-cardLabel">Total Doctors</div>
              <div className="ad-cardValue">{loading ? "..." : data.totalDoctors}</div>
            </div>
            <div className="ad-cardIcon blue"><i className="fa-solid fa-user-doctor"></i></div>
          </div>
        </div>

        <div className="ad-card">
          <div className="ad-cardTop">
            <div>
              <div className="ad-cardLabel">Total Patients</div>
              <div className="ad-cardValue">{loading ? "..." : data.totalPatients}</div>
            </div>
            <div className="ad-cardIcon green"><i className="fa-solid fa-users"></i></div>
          </div>
        </div>

        <div className="ad-card">
          <div className="ad-cardTop">
            <div>
              <div className="ad-cardLabel">Appointments</div>
              <div className="ad-cardValue">{loading ? "..." : data.totalAppointments}</div>
            </div>
            <div className="ad-cardIcon purple"><i className="fa-regular fa-calendar-check"></i></div>
          </div>
        </div>
      </div>

      <div className="ad-panel">
        <div className="ad-panelHead">
          <div className="ad-panelTitle">Recent Bookings</div>
        </div>

        {loading ? (
          <div className="ad-muted">Loading...</div>
        ) : data.recentBookings?.length === 0 ? (
          <div className="ad-muted">No bookings yet.</div>
        ) : (
          <div className="ad-list">
            {data.recentBookings.map((a) => (
              <div className="ad-listRow" key={a._id}>
                <div className="ad-listLeft">
                  <div className="ad-dot"></div>
                  <div>
                    <div className="ad-rowTitle">{a.patient?.name || "Patient"}</div>
                    <div className="ad-rowSub">
                      {a.doctor?.name || "Doctor"} • {a.department?.name || "Department"}
                    </div>
                  </div>
                </div>
                <div className="ad-rowRight">
                  <span className="ad-pill">{a.status || "Booked"}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}