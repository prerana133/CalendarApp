import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";
import { loginUser } from "../api";
import { Box, Button, TextField, Typography } from "@mui/material";

function Login({ setIsAuthenticated, setLoggedInUser, setUserRole }) {
  const [loginInfo, setLoginInfo] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;
    if (!email || !password) return handleError("Email and password are required");

    try {
      const result = await loginUser(loginInfo);
      const { success, message, jwtToken, name, role } = result;

      if (success) {
        handleSuccess(message);
        localStorage.setItem("token", jwtToken);
        localStorage.setItem("loggedInUser", name);
        localStorage.setItem("userRole", role);
        setIsAuthenticated(true);
        setLoggedInUser(name);
        setUserRole(role);
        setTimeout(() => navigate(role === "admin" ? "/admin" : "/home"), 1000);
      } else {
        handleError(message);
      }
    } catch (err) {
      handleError(err.message);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: "auto", padding: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Login
      </Typography>
      <form onSubmit={handleLogin}>
        <TextField
          label="Email"
          name="email"
          type="email"
          fullWidth
          margin="normal"
          variant="outlined"
          onChange={handleChange}
          value={loginInfo.email}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          fullWidth
          margin="normal"
          variant="outlined"
          onChange={handleChange}
          value={loginInfo.password}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Login
        </Button>
        <Box mt={2} textAlign="center">
          <Link to="/signup">Don't have an account? Sign Up</Link>
        </Box>
      </form>
      <ToastContainer />
    </Box>
  );
}

export default Login;
