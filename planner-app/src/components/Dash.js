import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../style/Dash.css"; // Ensure this CSS file exists

const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

const tasks = [
  { id: 1, category: "To-Do", text: "Wednesday To-Do Tasks List", color: "#DCD6F7" },
  { id: 1, category: "Done", text: "Wednesday Done Tasks List", color: "#F8A488" },
  { id: 2, category: "Events", text: "Wednesday Events List", color: "#F4A8B1" },
  { id: 2, category: "Marked Done Events", text: "Wednesday Marked Done Events List", color: "#FDF4E3" },
  { id: 2, category: "Other", text: "Other", color: "#1E1E1E", textColor: "#FFF" },
  { id: 3, category: "Other", text: "Other", color: "#9D93F7" },
];

const Dashboard = () => {
  const [selectedDay, setSelectedDay] = useState("wednesday");

  return (
    <div className="dashboard">
      <nav class="navbar">
            <ul>
            <li><Link to="/dashboard" className="active">Home</Link></li>
            <li><Link to="/task">Tasks</Link></li>
            <li><Link to="/schedule">Schedule</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            
            </ul>
            <img src="/planner-graphic.png" alt="Logo" className="logo" />
        </nav>

      <h1>What's going on today?</h1>

      <div className="day-selector">
        {days.map((day) => (
          <button
            key={day}
            className={day === selectedDay ? "selected" : ""}
            onClick={() => setSelectedDay(day)}
          >
            {day}
          </button>
        ))}
      </div>

      <div className="task-grid">
        {tasks.map((task) => (
          <div
            key={task.text}
            className="task-card"
            style={{ backgroundColor: task.color, color: task.textColor || "#000" }}
          >
            <span className="task-id">{task.id}</span>
            <p>{task.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;




// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios"; // Install axios if not installed: npm install axios
// import "./Dash.css";

// const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// const Dash = () => {
//   const [selectedDay, setSelectedDay] = useState("Wednesday"); // Default to Wednesday
//   const [tasks, setTasks] = useState([]); // Stores tasks fetched from the backend
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Fetch tasks from backend
//   useEffect(() => {
//     const fetchTasks = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get(`http://localhost:5000/api/tasks?day=${selectedDay}`);
//         setTasks(response.data);
//         setError(null);
//       } catch (err) {
//         setError("Failed to load tasks");
//         console.error(err);
//       }
//       setLoading(false);
//     };

//     fetchTasks();
//   }, [selectedDay]); // Runs when selectedDay changes

//   return (
//     <div className="dashboard">
//       <nav className="nav">
//         <Link to="/">Home</Link>
//         <Link to="/tasks">Tasks</Link>
//         <Link to="/schedule">Schedule</Link>
//         <Link to="/profile">Profile</Link>
//       </nav>

//       <h2>What's going on today?</h2>

//       <div className="day-selector">
//         {daysOfWeek.map((day) => (
//           <button
//             key={day}
//             className={selectedDay === day ? "active" : ""}
//             onClick={() => setSelectedDay(day)}
//           >
//             {day.toLowerCase()}
//           </button>
//         ))}
//       </div>

//       {loading ? <p>Loading...</p> : error ? <p>{error}</p> : null}

//       <div className="task-container">
//         {tasks.map((task) => (
//           <div
//             key={task.id}
//             className="task-card"
//             style={{ backgroundColor: task.color || "#ddd", color: task.textColor || "#000" }}
//           >
//             <span className="task-number">{task.id}</span>
//             <p>{task.title}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Dash;





