import Navbar from "./components/Navbar";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import { useAuth } from "./store/useAuth";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import ProtectRoute from "./components/ProtectRoute";
import { Toaster } from "react-hot-toast";
import { useTheme } from "./store/useTheme";
export default function App() {
  const { userAuth, checkAuth, isCheckingAuth } = useAuth();
  const { theme } = useTheme();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  if (isCheckingAuth && !userAuth) {
    return (
      <div
        className="flex items-center justify-center h-screen"
        data-theme={theme}
      >
        <Loader className="size-16 animate-spin" />
      </div>
    );
  }
  return (
    <div data-theme={theme}>
      <Navbar />
      <Toaster />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectRoute>
              <HomePage />
            </ProtectRoute>
          }
        />
        <Route
          path="/signup"
          element={!userAuth ? <Signup /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!userAuth ? <Login /> : <Navigate to="/" />}
        />
        <Route path="/settings" element={<Settings />} />
        <Route
          path="/profile"
          element={
            <ProtectRoute>
              <Profile />{" "}
            </ProtectRoute>
          }
        />
      </Routes>
    </div>
  );
}
