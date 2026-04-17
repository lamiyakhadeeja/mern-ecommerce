import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function AdminRoute() {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-muted" style={{ padding: "2rem", textAlign: "center" }}>Verifying admin access...</div>;

  if (!user) {
    return <Navigate to="/login" replace state={{ from: { pathname: "/admin" } }} />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
