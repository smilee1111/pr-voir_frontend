import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getAllEvents,
  createEvent,
  deleteEvent,
  updateEvent, // Add updateEvent import
} from "../apis/auth";
import "../style/Schedule.css";

const Schedule = () => {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [events, setEvents] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // New state for edit mode
  const [selectedEvent, setSelectedEvent] = useState(null); // New state for event being edited
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

  useEffect(() => {
    const fetchEvents = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        alert("User not logged in.");
        return;
      }

      try {
        const result = await getAllEvents();
        const filteredEvents = result.filter(event => event.userId === parseInt(userId));
        
        const eventData = {};
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
    setIsEditing(false); // Reset to create mode
    setSelectedEvent(null);
    setFormData({
      title: "",
      description: "",
      startdatetime: "12:00",
      enddatetime: "13:00",
      location: "",
    });
    setShowModal(true);
  };

  const handleEventClick = (event, day) => {
    setSelectedDate(day);
    setIsEditing(true);
    setSelectedEvent(event);
    // Format times for input fields
    const startTime = new Date(event.startdatetime).toTimeString().slice(0, 5);
    const endTime = new Date(event.enddatetime).toTimeString().slice(0, 5);
    setFormData({
      title: event.title,
      description: event.description || "",
      startdatetime: startTime,
      enddatetime: endTime,
      location: event.location || "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setSelectedEvent(null);
    setFormData({ title: "", description: "", startdatetime: "", enddatetime: "", location: "" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/");
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

    const userId = localStorage.getItem("userId");

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
      userId: parseInt(userId),
    };

    try {
      if (isEditing && selectedEvent) {
        // Update existing event
        const updatedEvent = await updateEvent(selectedEvent.eventid, eventData);
        if (!updatedEvent.error) {
          setEvents({
            ...events,
            [selectedDate]: events[selectedDate].map(event =>
              event.eventid === selectedEvent.eventid ? updatedEvent : event
            ),
          });
          closeModal();
        } else {
          alert("Error updating event: " + updatedEvent.error);
        }
      } else {
        // Create new event
        const newEvent = await createEvent(eventData);
        if (!newEvent.error) {
          setEvents({
            ...events,
            [selectedDate]: [...(events[selectedDate] || []), newEvent],
          });
          closeModal();
        } else {
          alert("Error saving event: " + newEvent.error);
        }
      }
    } catch (error) {
      console.error("Error submitting event:", error);
      alert("Error submitting event. Please try again.");
    }
  };

  const handleDeleteEvent = async (eventid, day) => {
    try {
      await deleteEvent(eventid);
      setEvents({
        ...events,
        [day]: events[day].filter((event) => event.eventid !== eventid),
      });
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

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
                <div 
                  key={day} 
                  className={`day ${isToday ? "today" : ""}`}
                  onClick={() => handleDateClick(day)}
                >
                  {day}
                  {events[day]?.map((event, eventIndex) => (
                    <div 
                      key={eventIndex} 
                      className="event"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering handleDateClick
                        handleEventClick(event, day);
                      }}
                    >
                      {event.title}
                      <span 
                        className="delete-icon" 
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering handleEventClick
                          handleDeleteEvent(event.eventid, day);
                        }}
                      >
                        🗑
                      </span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-btn" onClick={closeModal}>×</span>
            <h3>
              {isEditing ? "Edit Event" : "Add Event"} for {months[currentMonth]} {selectedDate}, {currentYear}
            </h3>
            <form onSubmit={handleSubmit}>
              <input 
                type="text" 
                name="title" 
                placeholder="Event Title" 
                value={formData.title} 
                onChange={handleChange} 
                required 
              />
              <textarea 
                name="description" 
                placeholder="Description" 
                value={formData.description} 
                onChange={handleChange}
              />
              <label>Start Time:</label>
              <input 
                type="time" 
                name="startdatetime" 
                value={formData.startdatetime} 
                onChange={handleChange} 
                required 
              />
              <label>End Time:</label>
              <input 
                type="time" 
                name="enddatetime" 
                value={formData.enddatetime} 
                onChange={handleChange} 
                required 
              />
              <input 
                type="text" 
                name="location" 
                placeholder="Location" 
                value={formData.location} 
                onChange={handleChange} 
                required 
              />
              <button type="submit" className="submit-btn">
                {isEditing ? "Update Event" : "Save Event"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;