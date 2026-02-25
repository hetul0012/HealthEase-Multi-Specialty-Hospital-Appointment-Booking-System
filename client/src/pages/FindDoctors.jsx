import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import api from "../api/api";

function renderStars(rating = 5) {
  const full = Math.round(rating);
  return Array.from({ length: full }).map((_, i) => (
    <i key={i} className="fa-solid fa-star" style={{ color: "#fbbf24" }}></i>
  ));
}

export default function FindDoctors() {
  const nav = useNavigate();
  const [params] = useSearchParams();

  const initialQ = params.get("q") || "";
  const initialDept = params.get("departmentId") || "";
  const initialSort = params.get("sort") || "recommended";

  const [q, setQ] = useState(initialQ);
  const [departmentId, setDepartmentId] = useState(initialDept);
  const [sort, setSort] = useState(initialSort);

  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async (override = {}) => {
    setLoading(true);
    try {
      const deptRes = await api.get("/departments");
      setDepartments(deptRes.data || []);

      const query = new URLSearchParams();
      const qVal = (override.q ?? q).trim();
      const deptVal = override.departmentId ?? departmentId;
      const sortVal = override.sort ?? sort;

      if (qVal) query.set("q", qVal);
      if (deptVal) query.set("departmentId", deptVal);
      if (sortVal) query.set("sort", sortVal);

      const docRes = await api.get(`/doctors?${query.toString()}`);
      setDoctors(docRes.data || []);
    } catch (e) {
      setDepartments([]);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const departmentOptions = useMemo(() => departments, [departments]);
  const onSearch = () => fetchAll({ q, departmentId, sort });

  return (
    <div className="page">
      <div className="container" style={{ padding: "28px 18px" }}>
        <h1 className="page-title">Find Your Doctor</h1>
        <p className="page-subtitle">
          Browse our network of experienced healthcare professionals
        </p>

        {/* FILTER CARD */}
        <div className="card filter-card">
          <div className="filter-grid">
            <div className="field">
              <label>Search Doctor</label>
              <input
                className="input"
                placeholder="Search by name or specialty..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>

            <div className="field">
              <label>Department</label>
              <select
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
              >
                <option value="">All Departments</option>
                {departmentOptions.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>&nbsp;</label>
              <button
                className="btn btn-primary"
                style={{ width: "100%", height: 40 }}
                onClick={onSearch}
              >
                <i
                  className="fa-solid fa-magnifying-glass"
                  style={{ marginRight: 8 }}
                ></i>
                Search
              </button>
            </div>
          </div>
        </div>

        {/* DOCTOR GRID */}
        <div className="doctor-grid">
          {doctors.map((doc) => (
            <div className="doc-card" key={doc._id}>
              <div className="doc-avatar">
                <img
                  src={
                    doc.imageUrl ||
                    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400"
                  }
                  alt={doc.name}
                />
              </div>

              <p className="doc-name">{doc.name}</p>
              <div className="doc-spec">{doc.specialization}</div>

              <div className="rating-row">
                <div className="stars">{renderStars(doc.rating)}</div>
                <div className="reviews">({doc.reviews || 0})</div>
              </div>

              <p className="doc-meta">
                {doc.experienceYears || 0} years experience
              </p>

              <div className="doc-lines">
                <div className="doc-line">
                  <i
                    className="fa-solid fa-calendar-days"
                    style={{ color: "#16a34a", marginRight: 6 }}
                  ></i>
                  {doc.availableStatus}
                </div>

                <div className="doc-line">
                  <i
                    className="fa-solid fa-clock"
                    style={{ color: "#2563eb", marginRight: 6 }}
                  ></i>
                  Next: {doc.nextSlot}
                </div>

                <div className="doc-line">
                  <i
                    className="fa-solid fa-location-dot"
                    style={{ color: "#ef4444", marginRight: 6 }}
                  ></i>
                  {doc.location}
                </div>
              </div>

              <button
                className="doc-btn"
                onClick={() => nav(`/book/${doc._id}`)}
              >
                <i
                  className="fa-solid fa-calendar-check"
                  style={{ marginRight: 6 }}
                ></i>
                Book Appointment
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="brand" style={{ color: "white" }}>
                <span className="brand-badge">
                  <i className="fa-solid fa-heart-pulse"></i>
                </span>
                HealthEase
              </div>
              <p>
                Providing exceptional healthcare services with compassion and
                expertise.
              </p>
            </div>

            <div>
              <h4>Quick Links</h4>
              <Link to="/about">About Us</Link>
              <Link to="/find-doctors">Our Doctors</Link>
              <Link to="/appointments">Services</Link>
              <Link to="/contact">Contact</Link>
            </div>

            <div>
              <h4>Services</h4>
              <a href="#">Cardiology</a>
              <a href="#">Dental Care</a>
              <a href="#">Surgery</a>
              <a href="#">Eye Care</a>
            </div>

            <div>
              <h4>Newsletter</h4>
              <p>Stay updated with our latest health tips and news.</p>
              <div className="news-row">
                <input placeholder="Your email" />
                <button title="Send">
                  <i className="fa-solid fa-paper-plane"></i>
                </button>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            © 2026 HealthEase. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}