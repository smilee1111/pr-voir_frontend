import React from "react";
import { useNavigate } from "react-router-dom";
import "../style/Landing.css";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="landing-content">
        <div className="landing-card">
          <h2><em>Plan your days ahead.</em></h2>
          <ul>
            <li>Create, Edit and Complete Tasks</li>
            <li>See what’s on your schedule.</li>
            <li>Stay motivated.</li>
          </ul>
          <div className="button-group">
            <button className="primary-btn" onClick={() => navigate("/register")}>
              Sign Up
            </button>
            <button className="secondary-btn" onClick={() => navigate("/login")}>
              Login
            </button>
          </div>
        </div>
        <div className="landing-image">
          <img src="/planner-graphic.png" alt="Planner Icon" />
        </div>
      </div>
    </div>
  );
};

export default Landing;
