import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Home from "./views/Home/Home.jsx";
import Login from "./views/Login/Login.jsx";
import Register from "./views/Register/Register.jsx";
import Courses from "./views/Courses/Courses.jsx";
import CourseDetails from "./views/CourseDetails/CourseDetails.jsx";
import Dashboard from "./views/Dashboard/Dashboard.jsx";
import NotFound from "./views/NotFound/NotFound.jsx";

export default function App() {
  return (
    <>
      <Navbar />

      <main className="container">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetails />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="footer">
        <p>
          © {new Date().getFullYear()} E-Learning Portal for Engineers
        </p>
      </footer>
    </>
  );
}