
import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios.js";
import "./ForgotPassword.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Please enter your registered email.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/users/forgot-password",
        { email: trimmedEmail }
      );

      setMessage(
        response.data?.message ||
          "If an account exists for this email, password reset instructions will be sent."
      );
    } catch (err) {
      console.error("Forgot password error:", err);

      if (err.response) {
        setError(
          err.response.data?.message ||
            "Unable to process your request. Please try again."
        );
      } else {
        setError(
          "Unable to connect to the server. Please try again."
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
          ACCOUNT RECOVERY
        </span>

        <h1>Forgot Password?</h1>

        <p className="forgot-description">
          Enter your registered email address to
          request a password reset.
        </p>

        {error && (
          <div className="form-error" role="alert">
            {error}
          </div>
        )}

        {message && (
          <div className="form-success" role="status">
            {message}
          </div>
        )}

        <label htmlFor="reset-email">
          Email
        </label>

        <input
          id="reset-email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
            setMessage("");
          }}
          placeholder="you@example.com"
          autoComplete="email"
          required
          disabled={loading}
        />

        <button
          type="submit"
          className="btn btn-primary full"
          disabled={loading}
        >
          {loading ? "Sending..." : "Reset Password"}
        </button>

        <p className="auth-bottom">
          Remember your password?{" "}
          <Link to="/login">
            Back to Login
          </Link>
        </p>
      </form>
    </div>
  );
}
