import React, { useState, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Notifications from "./pages/Notifications";
import CalendarView from "./pages/CalendarView";
import "./App.css";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState("");
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("loggedInUser");
    const role = localStorage.getItem("userRole");
    if (token && user && role) {
      setIsAuthenticated(true);
      setLoggedInUser(user);
      setUserRole(role);
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setLoggedInUser("");
    setUserRole("");
  };

  const PrivateRoute = ({ element, requiredRole }) => {
    if (!isAuthenticated) return <Navigate to="/login" />;
    if (requiredRole && userRole !== requiredRole) return <Navigate to="/home" />;
    return element;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <Navbar
        isAuthenticated={isAuthenticated}
        userName={loggedInUser}
        userRole={userRole}
        onLogout={handleLogout}
      />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route
          path="/login"
          element={
            <Login
              setIsAuthenticated={setIsAuthenticated}
              setLoggedInUser={setLoggedInUser}
              setUserRole={setUserRole}
            />
          }
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<PrivateRoute element={<Home />} />} />
        <Route
          path="/admin"
          element={<PrivateRoute element={<Admin />} requiredRole="admin" />}
        />
        <Route path="/notifications" element={<PrivateRoute element={<Notifications />} />} />
        <Route path="/calendar" element={<PrivateRoute element={<CalendarView />} />} />
      </Routes>
    </div>
  );
};

export default App;
