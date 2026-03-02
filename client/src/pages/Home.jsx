import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";

import heroImg from "../assets/hero.png";

const iconPalette = [
  { bg: "#e8f0ff", color: "#2f6bff", icon: "fa-solid fa-heart-pulse" },
  { bg: "#e9fff2", color: "#16a34a", icon: "fa-solid fa-brain" },
  { bg: "#f2ecff", color: "#7c3aed", icon: "fa-solid fa-bone" },
  { bg: "#ffecec", color: "#ef4444", icon: "fa-solid fa-lungs" },
  { bg: "#fff8db", color: "#f59e0b", icon: "fa-solid fa-eye" },
  { bg: "#eef2ff", color: "#6366f1", icon: "fa-solid fa-child" }
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Cardiology Patient",
    text:
      "The care I received was exceptional. Dr. Smith and the entire team made me feel comfortable throughout my treatment!",
    stars: 5,
    avatar:
      "https://images.unsplash.com/photo-1550525811-e5869dd03032?w=200&h=200&fit=crop"
  },
  {
    name: "Michael Chen",
    role: "Surgery Patient",
    text:
      "Professional, efficient, and caring. The surgical team was amazing and my recovery was smooth thanks to their expertise.",
    stars: 5,
    avatar:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=200&h=200&fit=crop"
  },
  {
    name: "Emily Davis",
    role: "Dental Patient",
    text:
      "Best dental experience I’ve ever had. The technology is cutting-edge and the staff is incredibly friendly and professional!",
    stars: 5,
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop"
  }
];

export default function Home() {
  const nav = useNavigate();

  // search bar state
  const [doctorName, setDoctorName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [availability, setAvailability] = useState("Any time");

  // departments from DB
  const [depts, setDepts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/departments")
      .then((r) => setDepts(r.data))
      .catch(() => setDepts([]))
      .finally(() => setLoading(false));
  }, []);

  const specialties = useMemo(() => {
   
    return ["Select specialty", "Cardiology", "Neurology", "Orthopedics", "Pulmonology", "Ophthalmology", "Pediatrics"];
  }, []);

  const onSearch = () => {

    const q = doctorName.trim();
    const sp = specialty && specialty !== "Select specialty" ? specialty : "";
    const av = availability !== "Any time" ? availability : "";

    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (sp) params.set("specialty", sp);
    if (av) params.set("availability", av);

    nav(`/find-doctors?${params.toString()}`);
  };

  return (
    <div className="page">
      {/* HERO */}
      <div className="hero">
        <div className="container">
          <div className="hero-grid">
            <div>
              <h1 className="hero-title">
                Your Health, <span>Our Priority</span>
              </h1>
              <p className="hero-sub">
                Experience world-class healthcare with our team of expert doctors and state-of-the-art facilities.
                Book your appointment today.
              </p>

              <div className="hero-actions">
                <Link className="btn btn-primary" to="/find-doctors">Find a Doctor</Link>
                <Link className="btn" to="/about">Learn More</Link>
              </div>
            </div>

            <div className="hero-img">
              <img src={heroImg} alt="Doctors" />
            </div>
          </div>

          {/* SEARCH CARD */}
          <div className="card search-card">
            <h3 className="search-title">Find the Right Doctor for You</h3>

            <div className="form-row">
              <div className="field">
                <label>Doctor Name</label>
                <input
                  className="input"
                  placeholder="Enter doctor name"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                />
              </div>

              <div className="field">
                <label>Specialty</label>
                <select value={specialty} onChange={(e) => setSpecialty(e.target.value)}>
                  {specialties.map((s) => (
                    <option key={s} value={s === "Select specialty" ? "" : s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label>Availability</label>
                <select value={availability} onChange={(e) => setAvailability(e.target.value)}>
                  <option>Any time</option>
                  <option>Available Today</option>
                  <option>Available Tomorrow</option>
                </select>
              </div>
            </div>

            <div className="search-btn-wrap">
            <button className="btn btn-primary" onClick={onSearch}>
               <i className="fa-solid fa-magnifying-glass" style={{ marginRight: 8 }}></i>
                 Search Doctors
            </button>
            </div>
          </div>
        </div>
      </div>

      {/* DEPARTMENTS */}
      <div className="section">
        <div className="container">
          <h2>Our Departments</h2>
          <p className="sub">Comprehensive healthcare services across all specialties</p>

          {loading && <p className="sub" style={{ marginTop: 14 }}>Loading departments...</p>}

          {!loading && depts.length === 0 && (
            <div className="card" style={{ padding: 16, marginTop: 18 }}>
              <p style={{ margin: 0, color: "#334155" }}>
                No departments found. Run seed:
                <b> POST http://localhost:5000/api/seed</b>
                <br />
                OR login as admin and add departments.
              </p>
            </div>
          )}

          <div className="dept-grid">
            {depts.slice(0, 6).map((d, idx) => {
              const style = iconPalette[idx % iconPalette.length];
              return (
                <div className="dept-card" key={d._id}>
                <div className="dept-icon" style={{ background: style.bg, color: style.color }}>
                  <i className={style.icon}></i>
                </div>
                  <p className="dept-name">{d.name}</p>
                  <p className="dept-desc">{d.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* STATS STRIP */}
      <div className="stats-strip">
        <div className="container">
          <div className="stats-grid">
            <div>
              <p className="stat-number">50,000+</p>
              <p className="stat-label">Happy Patients</p>
            </div>
            <div>
              <p className="stat-number">200+</p>
              <p className="stat-label">Expert Doctors</p>
            </div>
            <div>
              <p className="stat-number">98%</p>
              <p className="stat-label">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* TESTIMONIALS */}
      <div className="section" style={{ paddingTop: 34 }}>
        <div className="container">
          <h2>What Our Patients Say</h2>
          <p className="sub">Real stories from real people</p>

          <div className="testimonials-grid">
            {testimonials.map((t) => (
              <div className="t-card" key={t.name}>
                <div className="t-head">
                  <div className="avatar">
                    <img src={t.avatar} alt={t.name} />
                  </div>
                  <div>
                    <p className="t-name">{t.name}</p>
                    <p className="t-role">{t.role}</p>
                  </div>
                </div>

                <p className="t-text">“{t.text}”</p>
                <div className="stars">{"★★★★★".slice(0, t.stars)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="brand" style={{ color: "white" }}>
              <span className="brand-badge"><i className="fa-solid fa-heart-pulse"></i></span>
                HealthEase
              </div>
              <p>Providing exceptional healthcare services with compassion and expertise.</p>
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
                <button title="Send"><i className="fa-solid fa-paper-plane"></i></button>
              </div>
            </div>
          </div>

          <div className="footer-bottom">© 2026 HealthEase. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
