import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  const [dropdownVisible, setDropdownVisible] = useState(false); // State for dropdown visibility
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startdatetime: "",
    enddatetime: "",
    location: "",
  });
  const navigate = useNavigate();
  
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
      const userId = localStorage.getItem("userId"); // Get userId from localStorage
      if (!userId) {
        alert("User not logged in.");
        return;
      }

      try {
        const result = await getAllEvents();
        const filteredEvents = result.filter(event => event.userId === parseInt(userId));
        
        const eventData = {};
        // Group events by day, ensuring they are mapped correctly to each day of the current month
        for (let day = 1; day <= daysInMonth; day++) {
          eventData[day] = filteredEvents.filter(event => {
            const eventDate = new Date(event.startdatetime);
            return eventDate.getDate() === day && eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
          }) || [];
        }
        setEvents(eventData);
      } catch (error) {
        console.error("Error fetching events:", error);
        alert("Failed to fetch events.");
      }
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
    setSelectedDate(day);
    setFormData({
      title: "",
      description: "",
      startdatetime: "12:00", // Default time
      enddatetime: "13:00",   // Default time
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

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("userId"); // Remove user from localStorage
    localStorage.removeItem("token"); // Remove user from localStorage
    navigate("/login"); // Redirect to login page
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedFullDate = new Date(currentYear, currentMonth, selectedDate);
    const [startHours, startMinutes] = formData.startdatetime.split(":");
    const [endHours, endMinutes] = formData.enddatetime.split(":");

    const startDateTime = new Date(selectedFullDate);
    startDateTime.setHours(parseInt(startHours), parseInt(startMinutes), 0);

    const endDateTime = new Date(selectedFullDate);
    endDateTime.setHours(parseInt(endHours), parseInt(endMinutes), 0);

    // Get userId from localStorage or authentication state
    const userId = localStorage.getItem("userId"); // Ensure this is stored at login

    if (!userId) {
      alert("User not logged in.");
      return;
    }

    const eventData = {
      title: formData.title,
      description: formData.description,
      startdatetime: startDateTime.toISOString(),
      enddatetime: endDateTime.toISOString(),
      location: formData.location,
      userId: parseInt(userId), // Include userId
    };

    try {
      const newEvent = await createEvent(eventData);

      if (!newEvent.error) {
        setEvents({
          ...events,
          [selectedDate]: [...(events[selectedDate] || []), newEvent],
        });
        closeModal();
      } else {
        console.error("Error saving event:", newEvent.error);
        alert("Error saving event: " + newEvent.error);
      }
    } catch (error) {
      console.error("Error submitting event:", error);
      alert("Error submitting event. Please try again.");
    }
  };

  const handleDeleteEvent = async (eventid, day) => {
    try {
      await deleteEvent(eventid); // Pass the eventId to the backend
      setEvents({
        ...events,
        [day]: events[day].filter((event) => event.eventid !== eventid), // Ensure the filter is done on 'eventid' (not 'id')
      });
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
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
        <div className="navbar-right">
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

              <label>Start Time:</label>
              <input type="time" name="startdatetime" value={formData.startdatetime} onChange={handleChange} required />

              <label>End Time:</label>
              <input type="time" name="enddatetime" value={formData.enddatetime} onChange={handleChange} required />

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
