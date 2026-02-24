import { Navigate, useLocation } from "react-router-dom";
import { isLoggedIn, getUser } from "../auth";

export default function ProtectedRoute({ children, roles }) {
  const loc = useLocation();

  if (!isLoggedIn()) {
    return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  }

  if (roles && roles.length) {
    const user = getUser();
    if (!user || !roles.includes(user.role)) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}
