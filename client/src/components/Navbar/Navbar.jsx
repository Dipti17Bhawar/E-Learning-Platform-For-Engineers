import { Link } from "react-router-dom";
import { User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();

  const firstLetter = user?.name
    ? user.name.charAt(0).toUpperCase()
    : "";

  return (
    <nav className="navbar">

      {/* LEFT - WEBSITE LOGO */}
      <Link to="/" className="navbar-logo">
        TechSutra
      </Link>

      {/* CENTER - MAIN NAVIGATION */}
      <div className="navbar-center">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/reviews">Reviews</Link>
      </div>

      {/* RIGHT - USER / LOGIN */}
      <div className="navbar-right">

        {user ? (
          <>
            {/* USER LOGO → DASHBOARD */}
            <Link
              to="/dashboard"
              className="user-avatar"
              title="Dashboard"
            >
              {firstLetter || <User size={20} />}
            </Link>

            <button
              className="logout-btn"
              onClick={logout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="login-link">
              Login
            </Link>

            <Link to="/register" className="register-link">
              Register
            </Link>
          </>
        )}

      </div>

    </nav>
  );
}