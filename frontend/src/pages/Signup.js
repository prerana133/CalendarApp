import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";
import { signupUser } from "../api";
import { Box, Button, TextField, Typography } from "@mui/material";

function Signup() {
  const [signupInfo, setSignupInfo] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, password } = signupInfo;
    if (!name || !email || !password) {
      return handleError("Name, email, and password are required");
    }

    try {
      const result = await signupUser(signupInfo);
      const { success, message, error } = result;

      if (success) {
        handleSuccess(message);
        setTimeout(() => navigate("/login"), 1000);
      } else if (error) {
        const details = error?.details[0]?.message;
        handleError(details || message);
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
        Signup
      </Typography>
      <form onSubmit={handleSignup}>
        <TextField
          label="Name"
          name="name"
          type="text"
          fullWidth
          margin="normal"
          variant="outlined"
          onChange={handleChange}
          value={signupInfo.name}
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          fullWidth
          margin="normal"
          variant="outlined"
          onChange={handleChange}
          value={signupInfo.email}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          fullWidth
          margin="normal"
          variant="outlined"
          onChange={handleChange}
          value={signupInfo.password}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Signup
        </Button>
        <Box mt={2} textAlign="center">
          <Link to="/login">Already have an account? Login</Link>
        </Box>
      </form>
      <ToastContainer />
    </Box>
  );
}

export default Signup;
