import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import ProfileEditor from "./pages/ProfileEditor";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import PublicPortfolio from "./pages/PublicPortfolio";

function HomeRedirect() {
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? "/dashboard" : "/signin"} replace />;
}

function RedirectFromQuery() {
  const location = useLocation();
  const redirectPath = new URLSearchParams(location.search).get("redirect");

  return redirectPath ? <Navigate to={redirectPath} replace /> : null;
}

export default function App() {
  return (
    <AuthProvider>
      <RedirectFromQuery />
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/edit"
          element={
            <ProtectedRoute>
              <ProfileEditor />
            </ProtectedRoute>
          }
        />
        <Route path="/portfolio/:userId" element={<PublicPortfolio />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
