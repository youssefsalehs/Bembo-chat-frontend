import Navbar from "./components/Navbar";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import { useAuth } from "./store/useAuth";
import { useContext, useEffect } from "react";
import { Loader } from "lucide-react";
import ProtectRoute from "./components/ProtectRoute";
import { Toaster } from "react-hot-toast";
import { useTheme } from "./store/useTheme";
import { PreviewContext } from "./PreviewProvider";
import ImagePreview from "./components/ImagePreview";
export default function App() {
  const { userAuth, checkAuth, isCheckingAuth } = useAuth();
  const { theme } = useTheme();
  const { previewImages, setPreviewImages, currentIndex, setCurrentIndex } =
    useContext(PreviewContext);

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
      {previewImages.length > 0 && (
        <ImagePreview
          images={previewImages}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          setPreviewImages={setPreviewImages}
        />
      )}
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
