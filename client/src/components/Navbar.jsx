import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  return (
    <div className="nav">
      <div className="container">
        <div className="nav-inner">
          <Link className="brand" to="/">
          
            <span className="brand-badge">
              <i className="fa-solid fa-heart-pulse"></i>
            </span>
            HealthEase
          </Link>

          <div className="nav-links">
            <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
              Home
            </NavLink>
            <NavLink to="/find-doctors" className={({ isActive }) => (isActive ? "active" : "")}>
              Find Doctors
            </NavLink>
            <NavLink to="/appointments" className={({ isActive }) => (isActive ? "active" : "")}>
              Appointments
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => (isActive ? "active" : "")}>
              About
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) => (isActive ? "active" : "")}>
              Contact
            </NavLink>
          </div>

          <div className="spacer" />

          {!user ? (
            <>
              <Link className="btn" to="/login">Sign In</Link>
              <Link className="btn btn-primary" to="/register">Get Started</Link>
            </>
          ) : (
            <>
              {user.role === "patient" && <Link className="btn" to="/patient">Patient</Link>}
              {user.role === "doctor" && <Link className="btn" to="/doctor">Doctor</Link>}
              {user.role === "admin" && <Link className="btn" to="/admin">Admin</Link>}

              <button
                className="btn"
                onClick={() => {
                  logout();
                  nav("/");
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}