import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getCurrentRepresentative } from "../services/auth";

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function verifySession() {
      try {
        const representative = await getCurrentRepresentative();
        setUser(representative);
      } catch {
        sessionStorage.removeItem("access_token");
      } finally {
        setLoading(false);
      }
    }

    verifySession();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/mandir-login" replace />;
  }

  return children;
}

export default ProtectedRoute;