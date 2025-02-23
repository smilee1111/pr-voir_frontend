import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../apis/auth"; // import loginUser function
import "../style/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");  // Changed from username to email
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await loginUser({ email, password });  // Pass email instead of username

      if (response.token) {
        setMessage("Login successful!");
        setTimeout(() => navigate("/dashboard"), 2000); // Redirect after login
      } else {
        setMessage(response.error || "Login failed");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        {message && <p>{message}</p>}
        <label>Email</label> {/* Changed label to Email */}
        <input
          type="email"  // Updated input type to email
          placeholder="Enter email"
          value={email}  // Use email state
          onChange={(e) => setEmail(e.target.value)}  // Set email
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
