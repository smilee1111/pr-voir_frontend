
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../style/Task.css"; // Ensure this CSS file exists


const TaskBoard = () => {
  const [tasks, setTasks] = useState([]);

  const addTask = (category) => {
    const newTask = { id: Date.now(), text: "New Task", category };
    setTasks([...tasks, newTask]);
  };

  const editTask = (id) => {
    const newText = prompt("Edit Task", tasks.find(task => task.id === id)?.text);
    if (newText) {
      setTasks(tasks.map(task => task.id === id ? { ...task, text: newText } : task));
    }
  };


  return (
    <div className="tasks-page">
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
      <div className="task-board">
      {["To-Do", "Doing", "Done"].map((category) => (
        <div key={category} className="task-column">
          <h3 className={category.toLowerCase()}>{category}</h3>
          {tasks
            .filter((task) => task.category === category)
            .map((task) => (
              <div key={task.id} className="task-card">
                <span>{task.text}</span>
                <button onClick={() => editTask(task.id)}>✏️</button>
              </div>
            ))}
          <button onClick={() => addTask(category)}>+ Add new task</button>
        </div>
      ))}
    </div>
    </div>
  );
};

export default TaskBoard;
