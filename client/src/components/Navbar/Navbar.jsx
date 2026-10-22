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

  // Get the first letter of the student's name
  const firstLetter = user?.name
    ? user.name.charAt(0).toUpperCase()
    : "";

  // Close the mobile menu
  const closeMenu = () => {
    setMenuOpen(false);
  };

  // Logout and close the mobile menu
  const handleLogout = () => {
    closeMenu();
    logout();
  };

  return (
    <nav className="navbar">

      {/* LOGO */}

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


      {/* DESKTOP NAVIGATION */}

      <div className="navbar-center">
        <Link to="/" onClick={closeMenu}>
          Home
        </Link>

        <Link to="/about" onClick={closeMenu}>
          About
        </Link>

        <Link to="/reviews" onClick={closeMenu}>
          Reviews
        </Link>
      </div>


      {/* DESKTOP RIGHT */}

      <div className="navbar-right">

        {user ? (
          <>
            {/* STUDENT AVATAR AND NAME */}

            <Link
              to="/dashboard"
              className="student-profile"
              title="Go to Dashboard"
              onClick={closeMenu}
            >
              <div className="user-avatar">
                {firstLetter || (
                  <User size={20} />
                )}
              </div>

              <span className="student-name">
                {user.name || "Student"}
              </span>
            </Link>

            {/* LOGOUT */}

            <button
              type="button"
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            {/* LOGIN */}

            <Link
              to="/login"
              className="login-link"
              onClick={closeMenu}
            >
              Login
            </Link>

            {/* REGISTER */}

            <Link
              to="/register"
              className="register-link"
              onClick={closeMenu}
            >
              Register
            </Link>
          </>
        )}

      </div>


      {/* HAMBURGER BUTTON */}

      <button
        type="button"
        className="hamburger-button"
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label="Toggle navigation menu"
        aria-expanded={menuOpen}
      >
        {menuOpen ? (
          <X size={27} />
        ) : (
          <Menu size={27} />
        )}
      </button>


      {/* MOBILE MENU */}

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
                {/* MOBILE STUDENT PROFILE */}

                <Link
                  to="/dashboard"
                  onClick={closeMenu}
                  className="mobile-dashboard"
                >
                  <div className="user-avatar">
                    {firstLetter || (
                      <User size={18} />
                    )}
                  </div>

                  <span>
                    {user.name || "Student"}
                  </span>
                </Link>

                {/* MOBILE LOGOUT */}

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
                {/* MOBILE LOGIN */}

                <Link
                  to="/login"
                  onClick={closeMenu}
                >
                  Login
                </Link>

                {/* MOBILE REGISTER */}

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