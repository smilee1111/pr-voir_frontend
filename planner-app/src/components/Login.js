import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Username:", username);
    console.log("Password:", password);
    navigate("/dashboard"); // Redirect to dashboard
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
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
