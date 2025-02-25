import React, { useState, useEffect } from "react";
import "../style/Profile.css";
import { Link, useNavigate } from "react-router-dom";
import { getAllTasks,getTasksByUser } from "../apis/auth"; // Assuming the API function for fetching tasks is here
import TaskProgress from "../components/TaskProgress"; // Adjust the import based on where TaskProgress is located

const Profile = () => {
    const [tasks, setTasks] = useState([]);
    const [completedTasksToday, setCompletedTasksToday] = useState([]); // Store completed tasks today (array)
    const [dropdownVisible, setDropdownVisible] = useState(false); // State for dropdown visibility
    const [username, setUsername] = useState(""); // State for storing username
    const navigate = useNavigate();

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem("userId"); // Remove user from localStorage
        localStorage.removeItem("token"); // Remove user from localStorage
        localStorage.removeItem("username"); // Remove username from localStorage
        navigate("/login"); // Redirect to login page
    };

    // Toggle dropdown visibility
    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    useEffect(() => {
        const fetchUserTasks = async () => {
            const userId = localStorage.getItem("userId"); // Get userId from localStorage
            if (!userId) return;
    
            const data = await getTasksByUser(userId);
            if (!data.error) {
                setTasks(data);
    
                // Filter tasks completed today
                const today = new Date();
                const currentDateString = today.toISOString().split("T")[0];
    
                const completedTasksTodayList = data.filter((task) => {
                    const taskDate = new Date(`${currentDateString}T${task.duetime}`);
                    return task.status === "done" && taskDate.toDateString() === today.toDateString();
                });
    
                setCompletedTasksToday(completedTasksTodayList);
            } else {
                console.error(data.error);
            }
        };
    
        fetchUserTasks();
    }, []);
        // Set username from localStorage on component mount
        useEffect(() => {
          const storedUsername = localStorage.getItem("username"); // Fetch username from localStorage
          if (storedUsername) {
              setUsername(storedUsername); // Set username to state
          }
      }, []);

    return (
        <div className="profile-container">
            <nav className="navbar">
                <ul>
                    <li><Link to="/dashboard">Home</Link></li>
                    <li><Link to="/tasks">Tasks</Link></li>
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
                    <p className="tasks-title"><em>Goal Tracker chart</em></p>
                    <div className="tasks-line"></div>
                    {/* Add TaskProgress component here */}
                    <TaskProgress tasks={tasks} />
                    <div className="goal-tracker">
                        <p><em>Tasks Completed:</em></p>
                        <p>{completedTasksToday.length} task(s) completed</p>
                        {completedTasksToday.length > 0 && (
                            <ul>
                                {completedTasksToday.map((task) => (
                                    <li key={task.taskid}>{task.title}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
                <div className="user-section">
                <p className="username"><em>{username}</em></p> {/* Display the username here */}
                </div>
            </div>
        </div>
    );
};

export default Profile;