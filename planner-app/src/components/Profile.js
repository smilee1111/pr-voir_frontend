import React from "react";
import "../style/Profile.css";
import { Link } from "react-router-dom";

const Profile = () => {
  return (
    
    <div className="profile-container">
         <nav className="navbar">
              <ul>
                <li><Link to="/dashboard">Home</Link></li>
                <li><Link to="/tasks" >Tasks</Link></li>
                <li><Link to="/schedule">Schedule</Link></li>
                <li><Link to="/profile" className="active">Profile</Link></li>
              </ul>
              <img src="/planner-graphic.png" alt="Logo" className="logo" />
            </nav>
      <div className="profile-card">
        <div className="tasks-section">
          <p className="tasks-title"><em>Tasks completed today:</em></p>
          <div className="tasks-line"></div>
          <div className="goal-tracker">
            <p><em>Goal Tracker chart</em></p>
            <div className="chart-placeholder"></div>
          </div>
        </div>
        <div className="user-section">
          <div className="profile-photo">photo</div>
          <p className="username"><em>username</em></p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
