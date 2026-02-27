import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminLayout() {
  const nav = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div className="ad-shell">
      <aside className="ad-sidebar">
        <div className="ad-brand">
          <div className="ad-logo">
            <i className="fa-solid fa-heart-pulse"></i>
          </div>
          <div>
            <div className="ad-brandName">HealthEase</div>
            <div className="ad-subText">Admin Portal</div>
          </div>
        </div>

        <nav className="ad-nav">
          <NavLink end to="/admin" className={({ isActive }) => (isActive ? "ad-item active" : "ad-item")}>
            <i className="fa-solid fa-gauge"></i>
            Dashboard
          </NavLink>

          <NavLink to="/admin/doctors" className={({ isActive }) => (isActive ? "ad-item active" : "ad-item")}>
            <i className="fa-solid fa-user-doctor"></i>
            Doctors
          </NavLink>

          <NavLink to="/admin/patients" className={({ isActive }) => (isActive ? "ad-item active" : "ad-item")}>
            <i className="fa-solid fa-users"></i>
            Patients
          </NavLink>

          <NavLink to="/admin/appointments" className={({ isActive }) => (isActive ? "ad-item active" : "ad-item")}>
            <i className="fa-regular fa-calendar"></i>
            Appointments
          </NavLink>
        </nav>

        <button
          className="ad-logout"
          onClick={() => {
            logout();
            nav("/");
          }}
        >
          <i className="fa-solid fa-right-from-bracket"></i>
          Logout
        </button>
      </aside>

      <main className="ad-main">
        <div className="ad-topbar">
          <div className="ad-topTitle">Dashboard Overview</div>
          <div className="ad-topRight">
            <div className="ad-user">
              <i className="fa-regular fa-circle-user"></i>
              <span>{user?.name || "Admin"}</span>
            </div>
          </div>
        </div>

        <div className="ad-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}