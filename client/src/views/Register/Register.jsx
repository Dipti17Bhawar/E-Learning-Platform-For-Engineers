
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

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

  const [showPassword, setShowPassword] = useState(false);
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
      setError("Password must contain at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/users/register", {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      const { token, user } = response.data;

      if (!token || !user) {
        setError(
          "Registration response is incomplete. Please try again."
        );
        return;
      }

      register(token, user);

      navigate("/dashboard", {
        replace: true,
      });
    } catch (err) {
      console.error("Registration error:", err);

      if (err.response) {
        setError(
          err.response.data?.message ||
            "Registration failed."
        );
      } else if (err.request) {
        setError(
          "Unable to connect to the server. Please check the API connection."
        );
      } else {
        setError("Something went wrong. Please try again.");
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
          <div className="form-error" role="alert">
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
          autoComplete="name"
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

        <div className="password-wrapper">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
            placeholder="Minimum 6 characters"
            minLength={6}
            autoComplete="new-password"
            required
            disabled={loading}
          />

          <button
            type="button"
            className="password-toggle"
            onClick={() =>
              setShowPassword((prev) => !prev)
            }
            aria-label={
              showPassword ? "Hide password" : "Show password"
            }
            aria-pressed={showPassword}
            title={showPassword ? "Hide password" : "Show password"}
            disabled={loading}
          >
            {showPassword ? (
              <EyeOff size={20} />
            ) : (
              <Eye size={20} />
            )}
          </button>
        </div>

        <button
          type="submit"
          className="btn btn-primary full"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Account"}
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
