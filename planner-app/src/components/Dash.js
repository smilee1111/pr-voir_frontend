import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/Dash.css"; // Ensure this CSS file exists
import { getTasksByDay } from "../apis/auth";

const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

const Dashboard = () => {
  const navigate = useNavigate();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState(new Date().getDay()); // Default to today's weekday index
  const [tasks, setTasks] = useState({ todo: [], doing: [], done: [] });

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  // Fetch tasks when a day is selected
  const handleDayClick = async (dayIndex) => {
    setSelectedDay(dayIndex); // Update the selected day
    const fetchedTasks = await getTasksByDay(dayIndex); // Fetch tasks for the selected day

    // Group tasks by status
    const groupedTasks = {
      todo: fetchedTasks.filter(task => task.status === "to-do"),
      doing: fetchedTasks.filter(task => task.status === "doing"),
      done: fetchedTasks.filter(task => task.status === "done")
    };

    setTasks(groupedTasks); // Update tasks state with grouped tasks
  };

  // Fetch tasks when component loads (default to today's tasks)
  useEffect(() => {
    handleDayClick(selectedDay);
  }, []); // Ensure this effect runs once on component mount

  return (
    <div className="dashboard">
      <nav className="navbar">
        <ul>
          <li><Link to="/dashboard" className="active">Home</Link></li>
          <li><Link to="/tasks">Tasks</Link></li>
          <li><Link to="/schedule">Schedule</Link></li>
          <li><Link to="/profile">Profile</Link></li>
        </ul>
        <div className="navbar-right">
          <div className="logo-container">
            <img
              src="/planner-graphic.png"
              alt="Logo"
              className="logo"
              onClick={toggleDropdown}
            />
            {dropdownVisible && (
              <div className="dropdown-menu">
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <h1>What's going on today?</h1>

      <div className="day-selector">
        {days.map((day, index) => (
          <button
            key={day}
            className={index === selectedDay ? "selected" : ""}
            onClick={() => handleDayClick(index)}
          >
            {day}
          </button>
        ))}
      </div>

      <div className="task-grid">
        {/* To-Do Section */}
        <div className="task-section">
          <h3>To-Do Tasks</h3>
          <div className="task-container">
            {tasks.todo.length > 0 ? (
              tasks.todo.map((task) => (
                <div
                  key={task.taskid}
                  className="task-card"
                >
                  <p>{task.title}</p>
                </div>
              ))
            ) : (
              <div className="no-task-message">
                No To-Do tasks for {days[selectedDay]}.
              </div>
            )}
          </div>
        </div>

        {/* Doing Section */}
        <div className="task-section">
          <h3>Doing Tasks</h3>
          <div className="task-container">
            {tasks.doing.length > 0 ? (
              tasks.doing.map((task) => (
                <div
                  key={task.taskid}
                  className="task-card"
                >
                  <p>{task.title}</p>
                </div>
              ))
            ) : (
              <div className="no-task-message">
                No Doing tasks for {days[selectedDay]}.
              </div>
            )}
          </div>
        </div>

        {/* Done Section */}
        <div className="task-section">
          <h3>Done Tasks</h3>
          <div className="task-container">
            {tasks.done.length > 0 ? (
              tasks.done.map((task) => (
                <div
                  key={task.taskid}
                  className="task-card"
                >
                  <p>{task.title}</p>
                </div>
              ))
            ) : (
              <div className="no-task-message">
                No Done tasks for {days[selectedDay]}.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
