import { useEffect, useState } from "react";
import api from "../api/axios.js";
import CourseCard from "../components/CourseCard.jsx";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCourses = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/courses", {
        params: { search, category, level }
      });
      setCourses(response.data.courses);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchCourses();
  };

  return (
    <section>
      <div className="page-heading">
        <div>
          <span className="eyebrow">COURSES</span>
          <h1>Explore Engineering Courses</h1>
        </div>
      </div>

      <form className="filters" onSubmit={handleSubmit}>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search courses..."
        />

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Web Development">Web Development</option>
          <option value="IoT">IoT</option>
          <option value="Programming">Programming</option>
          <option value="Electronics">Electronics</option>
          <option value="Data Science">Data Science</option>
        </select>

        <select
          value={level}
          onChange={(event) => setLevel(event.target.value)}
        >
          <option value="">All Levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>

        <button className="button primary">Search</button>
      </form>

      {error && <div className="alert error">{error}</div>}

      {loading ? (
        <div className="center-message">Loading courses...</div>
      ) : courses.length === 0 ? (
        <div className="empty-state">No courses found.</div>
      ) : (
        <div className="course-grid">
          {courses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      )}
    </section>
  );
}
