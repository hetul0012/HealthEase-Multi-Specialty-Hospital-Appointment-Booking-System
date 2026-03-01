import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


export default function DoctorRoute() {
  const { user, token, authReady } = useAuth();

  if (!authReady) return <div style={{ padding: 24 }}>Loading...</div>;

  if (!token) return <Navigate to="/login" replace />;
  if (user?.role !== "admin") return <Navigate to="/" replace />;

  return <Outlet />;
}