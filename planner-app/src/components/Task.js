import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllTasks, createTask, updateTask } from "../apis/auth"; // Import API functions
import "../style/Task.css";

const TaskBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Task form state
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    description: "",
    dueTime: "",
    priority: "Low",
    category: "To-Do", // Default category
  });

  // Fetch tasks when the component loads
  useEffect(() => {
    const fetchTasks = async () => {
      const data = await getAllTasks();
      if (!data.error) {
        console.log("Fetched Tasks:", data); // Log to ensure tasks are fetched correctly
        setTasks(data);
      }
    };
    fetchTasks();
  }, []);

  // Open form for adding a new task
  const openAddForm = (category) => {
    setFormData({
      id: null,
      title: "",
      description: "",
      dueTime: "",
      priority: "Low",
      category: category || "To-Do", // Default to "To-Do" if category is undefined
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
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    console.log("Form Data Before Submit:", formData); // Log the entire form data
  
    if (!formData.taskid) { // Use taskid instead of id
      console.error("Task ID is undefined");
      return; // Prevent submission if ID is missing
    }
  
    const taskData = {
      ...formData,
      status: formData.category?.toLowerCase() || formData.status, // Ensure status is correctly passed
    };
  
    if (editMode) {
      const updatedTask = await updateTask(formData.taskid, taskData); // Use taskid instead of id
      if (!updatedTask.error) {
        setTasks((prevTasks) =>
          prevTasks.map((t) => (t.taskid === formData.taskid ? updatedTask : t)) // Update taskid instead of id
        );
      }
    } else {
      const newTask = await createTask(taskData);
      if (!newTask.error) {
        const data = await getAllTasks();
        setTasks(data);
      }
    }
  
    setShowForm(false);
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
        <img src="/planner-graphic.png" alt="Logo" className="logo" />
      </nav>

      <h2>What you need to get done.</h2>

      {/* Task Board */}
      <div className="task-board">
        {["To-Do", "Doing", "Done"].map((category) => (
          <div key={category} className="task-column">
            <h3 className={category.toLowerCase()}>{category}</h3>
            {tasks
              .filter((task) => task.status === category.toLowerCase()) // Change task.id to task.taskid if needed
              .map((task) => (
                <div key={task.taskid} className="task-card"> {/* Update task.id to task.taskid */}
                  <div>
                    <strong>{task.title}</strong>
                  </div>
                  <div>Description: {task.description}</div>
                  <div>Due: {task.dueTime}</div>
                  <div>Priority: {task.priority}</div>
                  <button onClick={() => openEditForm(task)}>✏️ Edit</button>
                </div>
              ))}

            <button className="add-task-btn" onClick={() => openAddForm(category)}>
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
                value={formData.dueTime}
                onChange={(e) => setFormData({ ...formData, dueTime: e.target.value })}
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

              <label>Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="To-Do">To-Do</option>
                <option value="Doing">Doing</option>
                <option value="Done">Done</option>
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
