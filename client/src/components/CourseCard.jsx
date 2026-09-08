import { Link } from "react-router-dom";

export default function CourseCard({ course }) {
  return (
    <article className="course-card">
      <img
        src={course.thumbnail}
        alt={course.title}
        onError={(event) => {
          event.currentTarget.src =
            "https://placehold.co/800x450?text=Course";
        }}
      />

      <div className="course-content">
        <span className="badge">{course.category}</span>
        <h3>{course.title}</h3>
        <p>{course.description}</p>

        <div className="course-meta">
          <span>{course.level}</span>
          <span>{course.duration}</span>
        </div>

        <Link className="button secondary" to={`/courses/${course._id}`}>
          View Course
        </Link>
      </div>
    </article>
  );
}
