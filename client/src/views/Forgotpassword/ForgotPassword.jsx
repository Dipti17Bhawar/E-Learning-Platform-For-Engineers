import { useState } from "react";
import { Link } from "react-router-dom";
import "./ForgotPassword.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email.trim()) {
      setError("Please enter your registered email.");
      return;
    }

    // Connect your backend password-reset API here.
    setMessage(
      "Password reset functionality needs to be connected to the backend."
    );
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
        />

        <button
          type="submit"
          className="btn btn-primary full"
        >
          Reset Password
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