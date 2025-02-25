import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// =======================
//  AUTHENTICATION APIS
// =======================

export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/users/register`, userData);
        return response.data;
    } catch (error) {
        return { error: error.response?.data?.message || "Registration failed" };
    }
};

export const loginUser = async (credentials) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/users/login`, credentials);
        if (response.data.token) {
            localStorage.setItem("token", response.data.token);
        }
        return response.data;
    } catch (error) {
        return { error: error.response?.data?.message || "Login failed" };
    }
};

export const getAllUsers = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/users/GetUsers`, { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        return { error: error.response?.data?.message || "Failed to fetch users" };
    }
};

export const updateUser = async (id, userData) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/users/UpdateUsers/${id}`, userData, { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        return { error: "Failed to update user" };
    }
};

export const deleteUser = async (id) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/users/DeleteUsers/${id}`, { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        return { error: "Failed to delete user" };
    }
};

// =======================
//  TASK MANAGEMENT APIS
// =======================

export const createTask = async (taskData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/task/createTask`, taskData, { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        return { error: "Task creation failed" };
    }
};

export const getAllTasks = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/task/getAllTask`, { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        return { error: "Failed to fetch tasks" };
    }
};

export const getTaskById = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/task/getTaskById/${id}`, { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        return { error: "Failed to fetch task" };
    }
};

export const updateTask = async (id, taskData) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/task/updateTask/${id}`, taskData, { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        return { error: "Task update failed" };
    }
};

export const deleteTask = async (id) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/task/deleteTask/${id}`, { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        return { error: "Task deletion failed" };
    }
};
export const getTasksByUser = async (userId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/task/getTasksByUser/${userId}`);
        return response.data;
    } catch (error) {
        return { error: error.response?.data || "Failed to fetch tasks" };
    }
};
export const getTasksByDay = async (dayIndex, userId) => {
    try {
      const response = await axios.get(`/task/getTasksByDay/${dayIndex}?userId=${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching tasks by day:", error);
      return [];
    }
  };
  

// =======================
//  EVENT MANAGEMENT APIS
// =======================

export const createEvent = async (eventData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/event/createEvent`, eventData, { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        return { error: "Event creation failed" };
    }
};

export const getAllEvents = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/event/getAllEvent`, { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        return { error: "Failed to fetch events" };
    }
};

export const getEventById = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/event/getEventById/${id}`, { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        return { error: "Failed to fetch event" };
    }
};

export const updateEvent = async (id, eventData) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/event/updateEvent/${id}`, eventData, { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        return { error: "Event update failed" };
    }
};
// =======================
//  EVENT MANAGEMENT APIS
// =======================

export const getEventsForDate = async (date) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/event/getEventsForDate`, {
            params: { date }, 
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        return { error: "Failed to fetch events for the date" };
    }
};

export const deleteEvent = async (id) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/event/deleteEvent/${id}`, { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        return { error: "Event deletion failed" };
    }
};