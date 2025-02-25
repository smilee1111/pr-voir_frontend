import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllTasks, createTask, updateTask, deleteTask } from "../apis/auth"; // Import API functions
import "../style/Task.css";

const TaskBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false); // State for dropdown visibility
  // Task form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duetime: "",
    status: "To-Do", // Default category
    priority: "Low",
  });
  const navigate = useNavigate();

  // Fetch tasks when the component loads
  useEffect(() => {
    const fetchTasks = async () => {
      const userId = localStorage.getItem("userId"); // Get current user's ID
      if (!userId) {
        console.error("User not logged in");
        return;
      }

      // Get tasks for the current user
      const data = await getAllTasks(userId); // Pass userId to API
      console.log("Fetched Tasks:", data); // Log to ensure tasks are fetched correctly
      if (!data.error) {
        // Filter tasks to only show the current user's tasks
        setTasks(data.filter((task) => task.userId === parseInt(userId))); // Ensure the userId is the same type (number)
      } else {
        console.error("Error fetching tasks:", data.error);
      }
    };
    fetchTasks();
  }, []); // Empty dependency array ensures it runs once when the component mounts

  // Open form for adding a new task
  const openAddForm = (status) => {
    setFormData({
      title: "",
      description: "",
      duetime: "",
      status: status || "To-Do", // Default to "To-Do" if category is undefined
      priority: "Low",
    });
    setEditMode(false);
    setShowForm(true);
  };

  const openEditForm = (task) => {
    console.log("Opening Edit Form for task:", task);
    if (!task.taskid) { // Corrected to use taskid
      console.error("Task ID is missing");
      return;
    }

    setFormData(task); // Ensures taskid is included
    setEditMode(true);
    setShowForm(true);
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("userId"); // Remove user from localStorage
    localStorage.removeItem("token"); // Remove user from localStorage
    localStorage.removeItem("username"); // Remove username from localStorage
    navigate("/login"); // Redirect to login page
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("userId");

    console.log("Form Data Before Submit:", formData); // Debugging log

    const taskData = {
      title: formData.title,
      description: formData.description,
      duetime: formData.duetime,
      status: formData.status?.toLowerCase() || formData.status, // Ensure status is correctly formatted
      priority: formData.priority,
      userId: userId, // Attach the user ID to associate the task with the logged-in user
    };

    if (editMode) {
      const updatedTask = await updateTask(formData.taskid, taskData);
      if (!updatedTask.error) {
        setTasks((prevTasks) =>
          prevTasks.map((t) => (t.taskid === formData.taskid ? updatedTask : t))
        );
      }
    } else {
      const newTask = await createTask(taskData);
      if (!newTask.error) {
        const data = await getAllTasks(userId); // Ensure to fetch tasks for the current user
        setTasks(data.filter((task) => task.userId === parseInt(userId))); // Filter tasks by user ID
      }
    }

    setShowForm(false);
  };

  // Handle task deletion
  const handleDelete = async (taskid) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) return;

    const response = await deleteTask(taskid);
    if (!response.error) {
      setTasks((prevTasks) => prevTasks.filter((task) => task.taskid !== taskid));
    }
  };

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <div className="tasks-page">
      {/* Navbar */}
      <nav className="navbar">
        <ul>
          <li><Link to="/dashboard">Home</Link></li>
          <li><Link to="/tasks" className="active">Tasks</Link></li>
          <li><Link to="/schedule">Schedule</Link></li>
          <li><Link to="/profile">Profile</Link></li>
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

      <h2>What you need to get done.</h2>

      {/* Task Board */}
      <div className="task-board">
        {["to-Do", "doing", "done"].map((status) => (
          <div key={status} className="task-column">
            <h3 className={status.toLowerCase()}>{status}</h3>
            {tasks
              .filter((task) => task.status === status.toLowerCase()) // Change task.id to task.taskid if needed
              .map((task) => (
                <div key={task.taskid} className="task-card"> {/* Update task.id to task.taskid */}
                  <div>
                    <strong>{task.title}</strong>
                  </div>
                  <div>Description: {task.description}</div>
                  <div>Due: {task.duetime}</div>
                  <div>Priority: {task.priority}</div>
                  <button onClick={() => openEditForm(task)}>✏️ Edit</button>
                  <button onClick={() => handleDelete(task.taskid)} className="delete-btn">🗑️ Delete</button>
                </div>
              ))}

            <button className="add-task-btn" onClick={() => openAddForm(status)}>
              + Add new task
            </button>
          </div>
        ))}
      </div>

      {/* Modal for Add/Edit Task */}
      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editMode ? "Edit Task" : "Add New Task"}</h2>
            <form onSubmit={handleSubmit}>
              <label>Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />

              <label>Description</label>
              <textarea
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />

              <label>Due Time</label>
              <input
                type="time"
                value={formData.duetime}
                onChange={(e) => setFormData({ ...formData, duetime: e.target.value })}
                required
              />

              <label>Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>

              <label>Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="to-do">To-Do</option>
                <option value="doing">Doing</option>
                <option value="done">Done</option>
              </select>

              <div className="modal-buttons">
                <button type="submit">{editMode ? "Update Task" : "Create Task"}</button>
                <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskBoard;
