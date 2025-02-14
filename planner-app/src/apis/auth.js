import axios from "axios";

const API_URL = "http://localhost:5001/api/users"; // Adjust if your backend is on another port

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || "Registration failed" };
  }
};
