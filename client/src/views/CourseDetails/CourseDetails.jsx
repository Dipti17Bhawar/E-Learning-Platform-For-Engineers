import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function CourseDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/courses/${id}`)
      .then((response) => setCourse(response.data.course))
      .catch((err) => {
        setError(err.response?.data?.message || "Course not found");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleEnroll = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const response = await api.post(`/courses/${id}/enroll`);
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Enrollment failed");
    }
  };

  if (loading) return <div className="center-message">Loading...</div>;
  if (error) return <div className="alert error">{error}</div>;
  if (!course) return null;

  return (
    <section className="details-page">
      <Link to="/courses" className="back-link">
        ← Back to Courses
      </Link>

      <div className="details-hero">
        <img src={course.thumbnail} alt={course.title} />

        <div>
          <span className="badge">{course.category}</span>
          <h1>{course.title}</h1>
          <p>{course.description}</p>
          <p>
            <strong>Instructor:</strong>{" "}
            {course.instructor?.name || "Instructor"}
          </p>

          <div className="course-meta">
            <span>{course.level}</span>
            <span>{course.duration}</span>
            <span>{course.lessons.length} lessons</span>
          </div>

          <button className="button primary" onClick={handleEnroll}>
            {user ? "Enroll Now" : "Login to Enroll"}
          </button>

          {message && <div className="alert success">{message}</div>}
        </div>
      </div>

      <div className="lessons">
        <h2>Course Lessons</h2>

        {course.lessons.length === 0 ? (
          <p>No lessons have been added yet.</p>
        ) : (
          course.lessons.map((lesson, index) => (
            <div className="lesson" key={lesson._id}>
              <div>
                <strong>
                  {index + 1}. {lesson.title}
                </strong>
                {lesson.duration && <small>{lesson.duration}</small>}
              </div>

              {lesson.videoUrl && (
                <a
                  href={lesson.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="button secondary"
                >
                  Watch
                </a>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}
