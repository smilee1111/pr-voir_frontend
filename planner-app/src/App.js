import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./components/Landing"; // Import Landing Page
import Register from "./components/Register";
import Login from "./components/Login";
import Dash from "./components/Dash";
import Task from "./components/Task";
import Schedule from "./components/Schedule";
import Profile from "./components/Profile";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />  {/* Set Landing as homepage */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dash />} />
        <Route path="/tasks" element={<Task />} /> 
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/profile" element={<Profile/>} />
      </Routes>
    </Router>
  );
};

export default App;
