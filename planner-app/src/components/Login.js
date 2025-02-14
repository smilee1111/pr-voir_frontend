import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../style/Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post("http://localhost:5001/api/users/login", { username, password });

      // Store JWT token (if needed)
      localStorage.setItem("token", response.data.token);

      setMessage("Login successful!");
      setTimeout(() => navigate("/dashboard"), 2000); // Redirect after login
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        {message && <p>{message}</p>}
        <label>Username</label>
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <p className="forgot-password">Forget Password?</p>

        <button type="submit">Login</button>

        <p className="signup-text">
          Not a Member? <a href="#" onClick={() => navigate("/")}>Signup</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
