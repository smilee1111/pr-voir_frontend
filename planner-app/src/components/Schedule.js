import React, { useState } from "react";
import { Link } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FaPen } from "react-icons/fa";
import "../style/Schedule.css";

const Schedule = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [newEvent, setNewEvent] = useState("");

  const handleAddEvent = () => {
    if (!newEvent.trim()) return;
    const formattedDate = date.toDateString();
    setEvents({
      ...events,
      [formattedDate]: [...(events[formattedDate] || []), newEvent],
    });
    setNewEvent("");
  };

  const handleEditEvent = (day, index) => {
    const updatedEvent = prompt("Edit your event:", events[day][index]);
    if (updatedEvent !== null) {
      const updatedEvents = [...events[day]];
      updatedEvents[index] = updatedEvent;
      setEvents({ ...events, [day]: updatedEvents });
    }
  };

  return (
    
    <div className="schedule-container">
      <nav className="navbar">
        <ul>
          <li><Link to="/dashboard">Home</Link></li>
          <li><Link to="/tasks" className="active">Tasks</Link></li>
          <li><Link to="/schedule">Schedule</Link></li>
          <li><Link to="/profile">Profile</Link></li>
        </ul>
        <img src="/planner-graphic.png" alt="Logo" className="logo" />
      </nav>
      <h2><em>Incoming events</em></h2>
      <div className="schedule-content">
        <div className="calendar-section">
          <Calendar onChange={setDate} value={date} />
        </div>
        <div className="events-section">
          <h3><em>Events:</em></h3>
          <ul>
            {(events[date.toDateString()] || []).map((event, index) => (
              <li key={index} className="event-item">
                {event} <FaPen className="edit-icon" onClick={() => handleEditEvent(date.toDateString(), index)} />
              </li>
            ))}
          </ul>
          <input
            type="text"
            placeholder="Add an event..."
            value={newEvent}
            onChange={(e) => setNewEvent(e.target.value)}
          />
          <button onClick={handleAddEvent}>Add Event</button>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
