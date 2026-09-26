import { useState } from "react";
import { Link } from "react-router-dom";
import {
  User,
  GraduationCap,
  Menu,
  X,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);

  const firstLetter = user?.name
    ? user.name.charAt(0).toUpperCase()
    : "";

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    closeMenu();
    logout();
  };

  return (
    <nav className="navbar">

      {/* --------------------------------
          LOGO
      -------------------------------- */}
      <Link
        to="/"
        className="navbar-logo"
        onClick={closeMenu}
      >
        <div className="techsutra-logo-icon">
          <GraduationCap
            size={25}
            strokeWidth={2.5}
          />
        </div>

        <span>TechSutra</span>
      </Link>


      {/* --------------------------------
          DESKTOP NAVIGATION
      -------------------------------- */}
      <div className="navbar-center">

        <Link to="/">
          Home
        </Link>

        <Link to="/about">
          About
        </Link>

        <Link to="/reviews">
          Reviews
        </Link>

      </div>


      {/* --------------------------------
          DESKTOP RIGHT
      -------------------------------- */}
      <div className="navbar-right">

        {user ? (
          <>
            <Link
              to="/dashboard"
              className="user-avatar"
              title="Dashboard"
            >
              {firstLetter || (
                <User size={20} />
              )}
            </Link>

            <button
              type="button"
              className="logout-btn"
              onClick={logout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="login-link"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="register-link"
            >
              Register
            </Link>
          </>
        )}

      </div>


      {/* --------------------------------
          HAMBURGER BUTTON
      -------------------------------- */}
      <button
        type="button"
        className="hamburger-button"
        onClick={() =>
          setMenuOpen(!menuOpen)
        }
        aria-label="Toggle navigation menu"
        aria-expanded={menuOpen}
      >
        {menuOpen ? (
          <X size={27} />
        ) : (
          <Menu size={27} />
        )}
      </button>


      {/* --------------------------------
          MOBILE MENU
      -------------------------------- */}
      {menuOpen && (
        <div className="mobile-menu">

          <div className="mobile-menu-links">

            <Link
              to="/"
              onClick={closeMenu}
            >
              Home
            </Link>

            <Link
              to="/about"
              onClick={closeMenu}
            >
              About
            </Link>

            <Link
              to="/reviews"
              onClick={closeMenu}
            >
              Reviews
            </Link>

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={closeMenu}
                  className="mobile-dashboard"
                >
                  <User size={18} />
                  Dashboard
                </Link>

                <button
                  type="button"
                  className="mobile-logout"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={closeMenu}
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="mobile-register"
                >
                  Register
                </Link>
              </>
            )}

          </div>

        </div>
      )}

    </nav>
  );
} 