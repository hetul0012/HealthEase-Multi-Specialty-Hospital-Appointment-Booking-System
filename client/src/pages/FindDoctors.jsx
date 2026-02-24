import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/api";

function starsText(rating = 5) {
  const full = Math.round(rating);
  return "★★★★★".slice(0, full);
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
      //  no "/api" here
      const deptRes = await api.get("/departments");
      setDepartments(deptRes.data || []);

      const query = new URLSearchParams();
      const qVal = (override.q ?? q).trim();
      const deptVal = override.departmentId ?? departmentId;
      const sortVal = override.sort ?? sort;

      if (qVal) query.set("q", qVal);
      if (deptVal) query.set("departmentId", deptVal);
      if (sortVal) query.set("sort", sortVal);

      //  no "/api" here
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
        <p className="page-subtitle">Browse our network of experienced healthcare professionals</p>

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
              <select value={departmentId} onChange={(e) => setDepartmentId(e.target.value)}>
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
              <button className="btn btn-primary" style={{ width: "100%", height: 40 }} onClick={onSearch}>
                 Search
              </button>
            </div>
          </div>
        </div>

        <div className="inline-row">
          <div>
            Showing <b>{loading ? "..." : doctors.length}</b> doctors
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span>Sort by:</span>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                fetchAll({ sort: e.target.value });
              }}
            >
              <option value="recommended">Recommended</option>
              <option value="rating">Highest Rating</option>
              <option value="experience">Most Experience</option>
            </select>
          </div>
        </div>

        {loading && <p className="page-subtitle" style={{ marginTop: 16 }}>Loading doctors...</p>}

        {!loading && doctors.length === 0 && (
          <div className="card" style={{ padding: 16, marginTop: 16 }}>
            <p style={{ margin: 0, color: "#334155" }}>
              No doctors found. Run seed again:
              <b> POST http://localhost:5000/api/seed</b>
            </p>
          </div>
        )}

        <div className="doctor-grid">
          {doctors.map((doc) => (
            <div className="doc-card" key={doc._id}>
              <div className="doc-avatar">
                <img
                  src={
                    doc.imageUrl ||
                    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop"
                  }
                  alt={doc.name}
                />
              </div>

              <p className="doc-name">{doc.name}</p>
              <div className="doc-spec">{doc.specialization}</div>

              <div className="rating-row">
                <div className="stars">{starsText(doc.rating)}</div>
                <div className="reviews">({doc.reviews || 0})</div>
              </div>

              <p className="doc-meta">{doc.experienceYears || 0} years experience</p>

              <div className="doc-lines">
                <div className="doc-line">
                  <div className="ico" style={{ color: "#16a34a" }}>📅</div>
                  <div>{doc.availableStatus}</div>
                </div>
                <div className="doc-line">
                  <div className="ico" style={{ color: "#2563eb" }}>⏰</div>
                  <div>Next: {doc.nextSlot}</div>
                </div>
                <div className="doc-line">
                  <div className="ico" style={{ color: "#ef4444" }}>📍</div>
                  <div>{doc.location}</div>
                </div>
              </div>

              {/* matches App.jsx /book/:doctorId */}
              <button className="doc-btn" onClick={() => nav(`/book/${doc._id}`)}>
                Book Appointment
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}