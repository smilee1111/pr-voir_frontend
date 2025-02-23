import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getAllEvents,
  createEvent,
  deleteEvent,
} from "../apis/auth"; // Import API functions
import "../style/Schedule.css";

const Schedule = () => {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [events, setEvents] = useState({}); // Store events by date
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startdatetime: "",
    enddatetime: "",
    location: "",
  });

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayIndex = getFirstDayOfMonth(currentYear, currentMonth);
  const emptySlots = Array(firstDayIndex).fill(null);

  // Fetch events from backend when month changes
  useEffect(() => {
    const fetchEvents = async () => {
      const eventData = {};
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentYear, currentMonth, day);
        const result = await getAllEvents();  // Adjusted to fetch all events
        // Filter events by day
        eventData[day] = result.filter(event => new Date(event.startdatetime).getDate() === day) || [];
      }
      setEvents(eventData);
    };
    fetchEvents();
  }, [currentYear, currentMonth]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDateClick = (day) => {
    const dateStr = `${months[currentMonth]} ${day}, ${currentYear}`;
    setSelectedDate(day);
    setFormData({
      title: "",
      description: "",
      startdatetime: `${currentYear}-${currentMonth + 1}-${day}T12:00`,
      enddatetime: `${currentYear}-${currentMonth + 1}-${day}T13:00`,
      location: "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({ title: "", description: "", startdatetime: "", enddatetime: "", location: "" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const eventData = {
      title: formData.title,
      description: formData.description,
      startdatetime: new Date(formData.startdatetime).toISOString(), // Convert to correct format
      enddatetime: new Date(formData.enddatetime).toISOString(), // Convert to correct format
      location: formData.location,
    };
  
    const newEvent = await createEvent(eventData);
  
    if (!newEvent.error) {
      setEvents({
        ...events,
        [selectedDate]: [...(events[selectedDate] || []), newEvent],
      });
      closeModal();
    } else {
      alert("Error saving event");
    }
  };
  
  const handleDeleteEvent = async (eventId, day) => {
    try {
      await deleteEvent(eventId); // Pass the eventId to the backend
      setEvents({
        ...events,
        [day]: events[day].filter((event) => event.eventid !== eventId), // Ensure the filter is done on 'eventid' (not 'id')
      });
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return (
    <div className="schedule-page">
      <nav className="navbar">
        <ul>
          <li><Link to="/dashboard">Home</Link></li>
          <li><Link to="/tasks">Tasks</Link></li>
          <li><Link to="/schedule" className="active">Schedule</Link></li>
          <li><Link to="/profile">Profile</Link></li>
        </ul>
        <img src="/planner-graphic.png" alt="Logo" className="logo" />
      </nav>

      <div className="schedule-container">
        <div className="calendar-header">
          <button className="nav-btn" onClick={handlePrevMonth}>◀</button>
          <h2 className="title">{months[currentMonth]} {currentYear}</h2>
          <button className="nav-btn" onClick={handleNextMonth}>▶</button>
        </div>

        <div className="calendar-grid">
          <div className="weekdays">
            <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span>
            <span>Thu</span><span>Fri</span><span>Sat</span>
          </div>

          <div className="days">
            {emptySlots.map((_, index) => (
              <div key={`empty-${index}`} className="empty-day"></div>
            ))}
            {[...Array(daysInMonth)].map((_, index) => {
              const day = index + 1;
              const isToday = day === today.getDate() &&
                              currentMonth === today.getMonth() &&
                              currentYear === today.getFullYear();

              return (
                <div key={day} className={`day ${isToday ? "today" : ""}`} onClick={() => handleDateClick(day)}>
                  {day}
                  {events[day]?.map((event, eventIndex) => {
                    return (
                      <div key={eventIndex} className="event">
                        {event.title}
                        <span className="delete-icon" onClick={() => handleDeleteEvent(event.eventid, day)}>🗑</span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-btn" onClick={closeModal}>&times;</span>
            <h3>Add Event for {months[currentMonth]} {selectedDate}, {currentYear}</h3>
            <form onSubmit={handleSubmit}>
              <input type="text" name="title" placeholder="Event Title" value={formData.title} onChange={handleChange} required />
              <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange}></textarea>

              <label>Start Date & Time:</label>
              <input type="datetime-local" name="startdatetime" value={formData.startdatetime} onChange={handleChange} required />

              <label>End Date & Time:</label>
              <input type="datetime-local" name="enddatetime" value={formData.enddatetime} onChange={handleChange} required />

              <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} required />

              <button type="submit" className="submit-btn">Save Event</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;
