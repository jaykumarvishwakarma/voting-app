import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Navbar from "./pages/Navbar";

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const sessionId = localStorage.getItem("sessionId");
  return sessionId ? children : <Navigate to="/login" replace />;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => !!localStorage.getItem("sessionId"));

  const handleLogout = () => {
    localStorage.removeItem("sessionId");
    setIsLoggedIn(false);
  };

  useEffect(() => {
    const handleStorage = () => setIsLoggedIn(!!localStorage.getItem("sessionId"));
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <BrowserRouter>
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <Routes>
        <Route
          path="/"
          element={
            <RequireAuth>
              <Home onLogout={handleLogout} />
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
