import React, { useState } from "react";
import "../style/ForgotPasswordForm.css"; // Import the specific CSS for this form

const ForgotPasswordForm = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simulate an API call to send a password reset link
    try {
      // Mock API call: Here, you would send the email to the server to process the reset request
      // For now, just simulate a successful response
      setMessage("Password reset link sent to your email.");
      setTimeout(() => onClose(), 3000); // Close the form after 3 seconds
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
    }
  };



  ///this is forgot password form that will appear upon clicking forgot pasword button in login
  return (
    <div className="forgot-password-form">
      <h2>Forgot Password</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
      <button className="close-button" onClick={onClose}>Close</button>
    </div>
  );
};

export default ForgotPasswordForm;
