import axios from "axios";

const API_URL = "http://localhost:5001/api"; // Adjust the backend URL if needed

// =======================
//  AUTHENTICATION APIS
// =======================

// Register User
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/users/register`, userData);
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || "Registration failed" };
  }
};

// Login User
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/users/login`, credentials);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token); // Save token for authentication
    }
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || "Login failed" };
  }
};

// Logout User
export const logoutUser = () => {
  localStorage.removeItem("token");
};

// =======================
//  TASK MANAGEMENT APIS
// =======================

// Create Task
export const createTask = async (taskData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_URL}/tasks`, taskData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || "Task creation failed" };
  }
};

// Get All Tasks
export const getAllTasks = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || "Failed to fetch tasks" };
  }
};

// Update Task
export const updateTask = async (taskId, taskData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${API_URL}/tasks/${taskId}`, taskData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || "Task update failed" };
  }
};

// Delete Task
export const deleteTask = async (taskId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${API_URL}/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || "Task deletion failed" };
  }
};
// Fetch events for a specific date
export const getEventsByDate = async (date) => {
  try {
    const formattedDate = date.toISOString().split("T")[0]; // Convert to YYYY-MM-DD
    const response = await axios.get(`${API_URL}/events/${formattedDate}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};

export const createEvent = async (eventData) => {
  try {
    const response = await axios.post(`${API_URL}/events`, eventData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating event:", error);
    return { error: true, message: error.response?.data?.message || "Unknown error" };
  }
};



// Update an event
export const updateEvent = async (eventId, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/events/${eventId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating event:", error);
    return { error: "Failed to update event" };
  }
};

// Delete an event
export const deleteEvent = async (eventId) => {
  try {
    await axios.delete(`${API_URL}/events/${eventId}`);
    return { message: "Event deleted successfully" };
  } catch (error) {
    console.error("Error deleting event:", error);
    return { error: "Failed to delete event" };
  }
};
