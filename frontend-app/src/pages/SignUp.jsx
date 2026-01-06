import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";

const logoUrl = "/logo.png";

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
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
      const response = await apiClient.post("/auth/register", formData);

      setMessage(
        (response.data.message || "Account created.") +
          " Redirecting to login..."
      );
      setIsError(false);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setIsError(true);
      setMessage(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formWrapper}>
        <img src={logoUrl} alt="Finvesto Logo" style={styles.logo} />
        <h2 style={styles.title}>Create your account</h2>

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
            <label htmlFor="email" style={styles.label}>
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              style={styles.input}
              value={formData.email}
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
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p style={styles.footerLink}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}

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
    borderRadius: "8px",
    backgroundColor: "#ffffff",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
  },
  logo: {
    marginBottom: "30px",
    maxWidth: "160px",
    height: "auto",
    objectFit: "contain",
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
    backgroundImage: "linear-gradient(to bottom right, #30209B, #24BEEB)",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "opacity 0.2s",
  },
  buttonDisabled: {
    backgroundImage: "linear-gradient(to bottom right, #5040B0, #64DFFF)",
    cursor: "not-allowed",
    opacity: 0.7,
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
