
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios.js";
import { useAuth } from "../../context/AuthContext.jsx";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    branch: "",
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

    if (!form.name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!form.email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (form.password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/users/register",
        {
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
        
        }
      );

      console.log(
        "Registration response:",
        response.data
      );

      const { token, user } = response.data;

      if (!token) {
        setError(
          "Registration completed, but token was not received."
        );
        return;
      }

      if (!user) {
        setError(
          "Registration completed, but user information was not received."
        );
        return;
      }

      // Store authentication through AuthContext
      register(token, user);

      // DIRECTLY GO TO DASHBOARD
      navigate("/dashboard", {
        replace: true,
      });

    } catch (err) {
      console.error(
        "Registration error:",
        err
      );

      if (err.response) {
        setError(
          err.response.data?.message ||
          "Registration failed."
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
          CREATE ACCOUNT
        </span>

        <h1>Student Registration</h1>

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        <label htmlFor="name">
          Full Name
        </label>

        <input
          id="name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          placeholder="Your name"
          required
          disabled={loading}
        />

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
          placeholder="Minimum 6 characters"
          minLength="6"
          autoComplete="new-password"
          required
          disabled={loading}
        />

        

        <button
          type="submit"
          className="btn btn-primary full"
          disabled={loading}
        >
          {loading
            ? "Creating..."
            : "Create Account"}
        </button>

        <p className="auth-bottom">
          Already registered?{" "}
          <Link to="/login">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
