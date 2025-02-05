import React from "react";
import { useNavigate } from "react-router-dom";  // Import useNavigate
import "../style/Register.css";


const Register = () => {
  const navigate = useNavigate();  // Initialize navigate

  return (
    <div className="register-container">
      <div className="register-form">
        <h2>Create your planner!</h2>
        <input type="email" placeholder="Enter your email" />
        <input type="tel" placeholder="Enter your phone no." />
        <input type="password" placeholder="Enter password" />
        <button>SIGN UP</button>
        <p>
          Already have an account?{" "}
          <a href="#" onClick={() => navigate("/login")}>Sign in</a> 
        </p>
      </div>

      <div className="register-image">
        <img src="/planner-graphic.png" alt="Planner Graphic" />
      </div>
    </div>
  );
};

export default Register;
