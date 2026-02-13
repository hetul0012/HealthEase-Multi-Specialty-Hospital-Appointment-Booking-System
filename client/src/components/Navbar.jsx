import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  return (
    <div className="nav">
      <div className="nav-inner">
        <Link className="brand" to="/">HealthEase</Link>
        <Link to="/find-doctors">Find Doctors</Link>
        <Link to="/appointments">Appointments</Link>

        <div className="spacer" />
        {!user ? (
          <>
            <Link className="btn" to="/login">Sign In</Link>
            <Link className="btn btn-primary" to="/register">Get Started</Link>
          </>
        ) : (
          <>
            {user.role === "patient" && <Link className="btn" to="/patient">Patient Portal</Link>}
            {user.role === "admin" && <Link className="btn" to="/admin">Admin Portal</Link>}
            <button className="btn" onClick={() => { logout(); nav("/"); }}>Logout</button>
          </>
        )}
      </div>
    </div>
  );
}
