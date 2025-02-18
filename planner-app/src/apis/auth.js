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
