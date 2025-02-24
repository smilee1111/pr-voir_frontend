import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../style/Register.css";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  phonenumber: null,
    password: "",
  });
  const [message, setMessage] = useState("");

  // Handle input change
  const handleChange = (e) => {
    let { name, value } = e.target;
  
    if (name === "phonenumber") {
      value = value ? parseInt(value, 10) : null; // Convert to integer or keep it null
    }
  
    setFormData({ ...formData, [name]: value });
  };
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5001/api/users/register", formData);
      setMessage(response.data.message);
      setTimeout(() => navigate("/login"), 2000); // Redirect after success
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h2>Create your planner!</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="username" placeholder="Enter your username" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Enter your email" onChange={handleChange} required />
          <input type="tel" name="phonenumber" placeholder="Enter your phone no." onChange={handleChange} required />
          <input type="password" name="password" placeholder="Enter password" onChange={handleChange} required />
          <button type="submit">SIGN UP</button>
        </form>
        {message && <p>{message}</p>}
        <p>
          Already have an account? <a href="#" onClick={() => navigate("/login")}>Sign in</a>
        </p>
      </div>
      <div className="register-image">
        <img src="/planner-graphic.png" alt="Planner Graphic" />
      </div>
    </div>
  );
};

export default Register;
