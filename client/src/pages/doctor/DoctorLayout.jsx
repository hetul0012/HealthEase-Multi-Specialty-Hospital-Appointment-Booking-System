import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function DoctorLayout() {
  const nav = useNavigate();
  const { logout, user } = useAuth();

  const firstName = (user?.name || "Doctor").split(" ")[0];

  return (
    <div className="page">
      <div className="container" style={{ padding: "22px 18px" }}>
        <div className="ad-shell">
         
          <aside className="ad-sidebar">
            <div className="ad-brand">
              <div className="ad-logo">
                <i className="fa-solid fa-heart-pulse"></i>
              </div>
              <div>
                <div className="ad-brandName">HealthEase</div>
                <div className="ad-subText">Doctor Portal</div>
              </div>
            </div>

            <nav className="ad-nav">
              <NavLink to="/doctor" end className={({ isActive }) => `ad-navItem ${isActive ? "active" : ""}`}>
                <i className="fa-solid fa-house"></i>
                <span>Dashboard</span>
              </NavLink>
                <NavLink to="/doctor/profile" className={({ isActive }) => `ad-navItem ${isActive ? "active" : ""}`}>
                <i className="fa-regular fa-user"></i>
                 <span>My Profile</span>
                  </NavLink>
              <NavLink
                to="/doctor/appointments"
                className={({ isActive }) => `ad-navItem ${isActive ? "active" : ""}`}
              >
                <i className="fa-regular fa-calendar-check"></i>
                <span>Appointments</span>
              </NavLink>
            </nav>

            <div className="ad-sidebarBottom">
              <button
                className="ad-logout"
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

        
          <main className="ad-main">
            <div className="ad-topbar">
              <div className="ad-topbarTitle">
                <i className="fa-solid fa-user-doctor"></i> {firstName}
              </div>
            </div>

            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}