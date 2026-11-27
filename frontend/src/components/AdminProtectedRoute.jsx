import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getCurrentAdmin } from "../services/auth";

function AdminProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    async function verifySession() {
      try {
        const currentAdmin = await getCurrentAdmin();
        setAdmin(currentAdmin);
      } catch {
        sessionStorage.removeItem("admin_access_token");
      } finally {
        setLoading(false);
      }
    }

    verifySession();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Verifying administrator...
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
}

export default AdminProtectedRoute;