import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="navbar">
      <Link className="brand" to="/">
        EngineerLearn
      </Link>

      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/courses">Courses</NavLink>

        {user ? (
          <>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <button className="link-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink className="nav-register" to="/register">
              Register
            </NavLink>
          </>
        )}
      </nav>
    </header>
  );
}
