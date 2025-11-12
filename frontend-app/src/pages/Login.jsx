import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient"; // Assuming you have this from previous steps

// This path directly references the image in your public folder
const logoUrl = "logo.png";

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setIsError(false);

    try {
      const response = await apiClient.post("/auth/login", formData);

      if (response.data.token) {
        localStorage.setItem("jwtToken", response.data.token);
        navigate("/");
      }
    } catch (error) {
      setIsError(true);
      setMessage(
        error.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formWrapper}>
        <img src={logoUrl} alt="Finvesto Logo" style={styles.logo} />
        <h2 style={styles.title}>Login to your account</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label htmlFor="username" style={styles.label}>
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              style={styles.input}
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              style={styles.input}
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {message && (
            <p style={isError ? styles.errorMessage : styles.successMessage}>
              {message}
            </p>
          )}

          <button
            type="submit"
            style={
              isLoading
                ? { ...styles.button, ...styles.buttonDisabled }
                : styles.button
            }
            disabled={isLoading}
          >
            {isLoading ? "Logging In..." : "Login"}
          </button>
        </form>

        <p style={styles.footerLink}>
          Don't have an account?{" "}
          <Link to="/signup" style={styles.link}>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

// --- CSS-in-JS for a clean, Zerodha-inspired theme ---
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
    fontFamily: "'Inter', sans-serif",
  },
  formWrapper: {
    padding: "40px 50px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    borderRadius: "4px",
    backgroundColor: "#ffffff",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
  },
  // --- THIS IS THE FIX ---
  logo: {
    marginBottom: "30px",
    maxWidth: "160px", // The image can't be wider than 160px
    height: "auto", // Height will adjust automatically to maintain aspect ratio
    objectFit: "contain", // Ensures the whole image is visible
  },
  title: {
    fontSize: "22px",
    marginBottom: "30px",
    color: "#444",
    fontWeight: 500,
  },
  form: {
    textAlign: "left",
  },
  inputGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    color: "#666",
    fontSize: "14px",
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    boxSizing: "border-box",
    fontSize: "14px",
  },
  button: {
    width: "100%",
    padding: "12px",
    // Use background-image for the gradient
    backgroundImage: "linear-gradient(to bottom right, #30209B, #24BEEB)",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    // You might want to remove or adjust the background-color for transition if it interferes
    // transition: 'background-color 0.2s',
    // If you want a subtle hover effect, you could change the gradient slightly or add a box-shadow
  },
  buttonDisabled: {
    // For the disabled state, you might want a simpler, muted gradient or a solid color
    backgroundImage: "linear-gradient(to bottom right, #5040B0, #64DFFF)", // Slightly muted version
    cursor: "not-allowed",
  },
  footerLink: {
    textAlign: "center",
    marginTop: "25px",
    color: "#666",
    fontSize: "14px",
  },
  link: {
    color: "#387ed1",
    textDecoration: "none",
    fontWeight: "bold",
  },
  errorMessage: {
    color: "#e74c3c",
    textAlign: "center",
    marginBottom: "15px",
    fontSize: "14px",
  },
  successMessage: {
    color: "#2ecc71",
    textAlign: "center",
    marginBottom: "15px",
    fontSize: "14px",
  },
};
