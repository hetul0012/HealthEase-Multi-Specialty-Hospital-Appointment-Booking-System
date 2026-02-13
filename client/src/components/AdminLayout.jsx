import { Link, Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="layout">
      <div className="sidebar">
        <h3>Admin</h3>
        <div className="grid">
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/departments">Departments</Link>
          <Link to="/admin/doctors">Doctors</Link>
          <Link to="/admin/patients">Patients</Link>
          <Link to="/admin/appointments">Appointments</Link>
        </div>
      </div>
      <div className="container" style={{ flex: 1 }}>
        <Outlet />
      </div>
    </div>
  );
}
