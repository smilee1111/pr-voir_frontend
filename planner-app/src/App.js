import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./components/Landing"; // Import Landing Page
import Register from "./components/Register";
import Login from "./components/Login";
import Dash from "./components/Dash";
import Task from "./components/Task";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />  {/* Set Landing as homepage */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dash />} />
        <Route path="/task" element={<Task />} /> 
        <Route path="/schedule" element={<div>Schedule Page</div>} />
        <Route path="/profile" element={<div>Profile Page</div>} />
      </Routes>
    </Router>
  );
};

export default App;
