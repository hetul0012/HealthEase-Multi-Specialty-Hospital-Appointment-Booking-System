import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";

function Stars({ rating = 4.9, reviews = 120 }) {
  const full = Math.round(rating);
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <span style={{ color: "#f4b400", letterSpacing: 1 }}>
        {"★★★★★".slice(0, full)}
      </span>
      <span style={{ color: "#64748b", fontSize: 12 }}>
        {rating.toFixed(1)} ({reviews} reviews)
      </span>
    </span>
  );
}

export default function DoctorDetails() {
  const { id } = useParams();
  const nav = useNavigate();

  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/api/doctors/${id}`)
      .then((res) => setDoc(res.data))
      .catch(() => setDoc(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="page">
        <div className="container doc-page">
          <p className="page-subtitle">Loading doctor details...</p>
        </div>
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="page">
        <div className="container doc-page">
          <div className="card" style={{ padding: 16 }}>
            Doctor not found.
          </div>
        </div>
      </div>
    );
  }

  const img =
    doc.imageUrl ||
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop";

 
  const aboutText =
    "Dr. " +
    doc.name.replace("Dr. ", "") +
    " is a renowned " +
    (doc.specialization || "specialist").toLowerCase() +
    " with over " +
    (doc.experienceYears || 10) +
    " years of experience in delivering patient-centered care. Specializes in preventive care, diagnosis, and minimally invasive procedures.";

  const education = [
    "MD - Harvard Medical School (2008)",
    "Residency - Johns Hopkins Hospital (2012)",
    "Fellowship - Mayo Clinic (2014)",
  ];

  const specializations = [
    "Preventive Care",
    "Heart Disease Management",
    "Cardiac Catheterization",
  ];

  return (
    <div className="page">
      <div className="container doc-page">
        <div className="breadcrumb">Home &gt; Doctors &gt; {doc.name}</div>

        <div className="doc-layout">
          {/* LEFT SIDE */}
          <div>
            <div className="card" style={{ padding: 18 }}>
              {/* header */}
              <div className="doc-header">
                <div className="doc-left">
                  <div className="doc-photo">
                    <img src={img} alt={doc.name} />
                  </div>

                  <div className="doc-title">
                    <h2>{doc.name}</h2>
                    <div className="spec">{doc.specialization}</div>

                    <div className="doc-submeta">
                      <Stars rating={doc.rating || 4.9} reviews={doc.reviews || 120} />
                      <span className="badge-line">📍 New York, NY</span>
                      <span className="badge-line">🩺 {doc.experienceYears || 10}+ Years Experience</span>
                      <span className="badge-line">👥 2,500+ Patients</span>
                      <span className="badge-line">Board Certified</span>
                    </div>
                  </div>
                </div>

                <button className="heart-btn" title="Save">♡</button>
              </div>

              {/* about */}
              <div style={{ marginTop: 16 }}>
                <p className="section-title">About {doc.name}</p>
                <p className="text-muted">{aboutText}</p>
              </div>

              <div className="split-two">
                <div>
                  <p className="section-title" style={{ fontSize: 14 }}>Education</p>
                  <ul className="bullets">
                    {education.map((e) => (
                      <li key={e}>{e}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="section-title" style={{ fontSize: 14 }}>Specializations</p>
                  <ul className="bullets">
                    {specializations.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="card" style={{ padding: 18, marginTop: 16 }}>
              <p className="section-title">Availability</p>

              <div className="availability-grid">
                {[
                  { day: "Mon", date: "Jan 29", slots: ["9:00 AM", "2:00 PM", "4:00 PM"] },
                  { day: "Tue", date: "Jan 30", slots: ["10:00 AM", "1:00 PM", "5:30 PM"] },
                  { day: "Wed", date: "Jan 31", slots: ["9:00 AM", "11:00 AM", "2:30 PM"] },
                  { day: "Thu", date: "Feb 1", slots: ["8:30 AM", "1:30 PM", "4:30 PM"] },
                  { day: "Fri", date: "Feb 2", slots: ["9:30 AM", "12:00 PM", "3:00 PM"] },
                  { day: "Sat", date: "Feb 3", slots: ["Closed"], off: true },
                  { day: "Sun", date: "Feb 4", slots: ["Closed"], off: true },
                ].map((d) => (
                  <div className="day-col" key={d.day}>
                    <b>{d.day}</b>
                    <div style={{ fontSize: 11, marginBottom: 6 }}>{d.date}</div>
                    {d.slots.map((t) => (
                      <span key={t} className={`slot ${d.off ? "off" : ""}`}>
                        {t}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div>
            <div className="card side-card" style={{ padding: 18 }}>
              <h3>${doc.fee || 150}</h3>
              <div className="fee-sub">Consultation Fee</div>

              <div className="side-list">
                <div className="side-row"><span>🕒</span><span>30 minutes consultation</span></div>
                <div className="side-row"><span>📹</span><span>Video call available</span></div>
                <div className="side-row"><span>📅</span><span>Same day appointments</span></div>
              </div>

              <div className="side-actions">
                <button className="btn btn-primary" style={{ width: "100%", height: 40 }} onClick={() => nav(`/book/${doc._id}`)}>
                  Book Appointment
                </button>
                <button className="btn-outline" onClick={() => alert("Message feature coming soon!")}>
                  Send Message
                </button>
              </div>

              <div className="divider"></div>

              <p className="section-title" style={{ marginBottom: 10 }}>Hospital Information</p>
              <div className="hospital-info">
                <div className="side-row"><span>🏥</span><span>Manhattan Medical Center</span></div>
                <div className="side-row"><span>📍</span><span>123 Medical Plaza, New York, NY 10001</span></div>
                <div className="side-row"><span>📞</span><span>(555) 123-4567</span></div>
                <div className="side-row"><span>✉️</span><span>info@manhattanmed.com</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
