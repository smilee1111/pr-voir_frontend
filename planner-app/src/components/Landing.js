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
          <button className="get-started-btn" onClick={() => navigate("/register")}>
            Get Started
            <img src="/click.png" alt="Click Icon" />
          </button>
        </div>
        <div className="landing-image">
          <img src="/planner-graphic.png" alt="Planner Icon" />
        </div>
      </div>
    </div>
  );
};

export default Landing;
