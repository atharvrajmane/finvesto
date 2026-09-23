import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Guard against visual flashing while the app checks for an active session
  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: "100vh",
        fontFamily: "'Inter', sans-serif",
        color: "#666"
      }}>
        Loading Finvesto Dashboard...
      </div>
    );
  }

  // Kick out unauthenticated users
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;