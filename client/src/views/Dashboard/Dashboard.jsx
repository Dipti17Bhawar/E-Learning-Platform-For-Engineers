import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import api from "../api/axios.js";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Dashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/courses/student/enrolled")
      .then((response) => setCourses(response.data.courses))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section>
      <div className="dashboard-header">
        <div>
          <span className="eyebrow">STUDENT DASHBOARD</span>
          <h1>Welcome, {user?.name}</h1>
          <p>Continue learning from your enrolled courses.</p>
        </div>

        <Link className="button primary" to="/courses">
          Browse Courses
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <strong>{courses.length}</strong>
          <span>Enrolled Courses</span>
        </div>
        <div className="stat-card">
          <strong>{user?.role}</strong>
          <span>Account Type</span>
        </div>
        <div className="stat-card">
          <strong>Active</strong>
          <span>Learning Status</span>
        </div>
      </div>

      <h2>My Courses</h2>

      {loading ? (
        <div className="center-message">Loading...</div>
      ) : courses.length === 0 ? (
        <div className="empty-state">
          <h3>No enrolled courses yet</h3>
          <p>Explore the course catalog and enroll in a course.</p>
          <Link className="button primary" to="/courses">
            Explore Courses
          </Link>
        </div>
      ) : (
        <div className="course-grid">
          {courses.map((course) => (
            <article className="course-card" key={course._id}>
              <img src={course.thumbnail} alt={course.title} />
              <div className="course-content">
                <span className="badge">{course.category}</span>
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <Link
                  className="button secondary"
                  to={`/courses/${course._id}`}
                >
                  Continue
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
