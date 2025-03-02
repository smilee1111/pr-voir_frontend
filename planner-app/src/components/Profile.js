import React, { useState, useEffect } from "react";
import "../style/Profile.css";
import { Link, useNavigate } from "react-router-dom";
import { getTasksByUser } from "../apis/auth"; // Assuming the API function for fetching tasks is here
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
        navigate("/"); // Redirect to login page
    };

    // Toggle dropdown visibility
    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    useEffect(() => {
        const fetchUserTasks = async () => {
            const userId = localStorage.getItem("userId"); // Get userId from localStorage
            if (!userId) return;

            // Fetch tasks for the user
            const data = await getTasksByUser(userId);
            if (!data.error) {
                setTasks(data);

                // Filter tasks completed today
                const today = new Date();
                const currentDateString = today.toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format

                const completedTasksTodayList = data.filter((task) => {
                    // If duetime is only a time, prepend today's date
                    let taskDateString = task.duetime;
                    if (taskDateString && !taskDateString.includes("T")) {
                        taskDateString = `${currentDateString}T${taskDateString}`;
                    }

                    // Ensure duetime is a valid date string
                    const taskDate = new Date(taskDateString);

                    // Check if taskDate is a valid date object
                    if (isNaN(taskDate.getTime())) {
                        console.warn(`Invalid duetime for task: ${task.taskid}`);
                        return false; // Skip tasks with invalid duetime
                    }

                    const taskDateOnlyString = taskDate.toISOString().split("T")[0]; // Get task's date part (YYYY-MM-DD)

                    return task.status === "done" && taskDateOnlyString === currentDateString;
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
                    <p className="tasks-title"><em>Goal Tracker</em></p>
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
