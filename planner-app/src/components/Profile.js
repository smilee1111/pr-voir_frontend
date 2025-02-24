import React,{ useState, useEffect }  from "react";
import "../style/Profile.css";
import { Link,useNavigate } from "react-router-dom";

const Profile = () => {

  const [dropdownVisible, setDropdownVisible] = useState(false); // State for dropdown visibility

  const navigate=useNavigate();

      // Logout function
      const handleLogout = () => {
        localStorage.removeItem("userId"); // Remove user from localStorage
        localStorage.removeItem("token"); // Remove user from localStorage
        navigate("/login"); // Redirect to login page
      };

        // Toggle dropdown visibility
    const toggleDropdown = () => {
      setDropdownVisible(!dropdownVisible);
    };
  
    
  return (
    
    <div className="profile-container">
         <nav className="navbar">
              <ul>
                <li><Link to="/dashboard">Home</Link></li>
                <li><Link to="/tasks" >Tasks</Link></li>
                <li><Link to="/schedule">Schedule</Link></li>
                <li><Link to="/profile" className="active">Profile</Link></li>
              </ul>
              <div className="navbar-right">
          {/* Logo and dropdown */}
          <div className="logo-container">
            <img
              src="/planner-graphic.png"
              alt="Logo"
              className="logo"
              onClick={toggleDropdown} // Toggle dropdown on logo click
            />
            {dropdownVisible && (
              <div className="dropdown-menu">
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </div>
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
