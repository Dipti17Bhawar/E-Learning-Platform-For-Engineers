
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios.js";
import { useAuth } from "../../context/AuthContext.jsx";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!form.password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/users/login", {
        email: form.email.trim(),
        password: form.password,
      });

      console.log("Login response:", response.data);

      const { token, user } = response.data;

      if (!token) {
        setError(
          "Login successful, but token was not received."
        );
        return;
      }

      if (!user) {
        setError(
          "Login successful, but user information was not received."
        );
        return;
      }

      // Store authentication through AuthContext
      login(token, user);

      // DIRECTLY GO TO DASHBOARD
      navigate("/dashboard", {
        replace: true,
      });

    } catch (err) {
      console.error("Login error:", err);

      if (err.response) {
        setError(
          err.response.data?.message ||
          "Invalid email or password."
        );
      } else if (err.request) {
        setError(
          "Server is not running. Please start the backend."
        );
      } else {
        setError(
          "Something went wrong. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form
        className="auth-card"
        onSubmit={handleSubmit}
      >
        <span className="eyebrow">
          WELCOME BACK
        </span>

        <h1>Student Login</h1>

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        <label htmlFor="email">
          Email
        </label>

        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
          autoComplete="email"
          required
          disabled={loading}
        />

        <label htmlFor="password">
          Password
        </label>

        <input
          id="password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Enter your password"
          autoComplete="current-password"
          required
          disabled={loading}
        />

        <button
          type="submit"
          className="btn btn-primary full"
          disabled={loading}
        >
          {loading
            ? "Logging in..."
            : "Login"}
        </button>

        <p className="auth-bottom">
          Don't have an account?{" "}
          <Link to="/register">
            Create Account
          </Link>
        </p>
      </form>
    </div>
  );
}

