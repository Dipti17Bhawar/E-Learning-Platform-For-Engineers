import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="hero">
      <div className="hero-content">
        <span className="eyebrow">LEARN • BUILD • GROW</span>
        <h1>E-Learning Platform for Engineers</h1>
        <p>
          Learn programming, electronics, IoT, web development and other
          engineering skills through structured online courses.
        </p>

        <div className="hero-actions">
          <Link className="button primary" to="/courses">
            Explore Courses
          </Link>
          <Link className="button secondary" to="/register">
            Create Account
          </Link>
        </div>
      </div>

      <div className="feature-grid">
        <div className="feature-box">
          <h3>📚 Structured Courses</h3>
          <p>Learn topic by topic with organized lessons.</p>
        </div>
        <div className="feature-box">
          <h3>💻 Engineering Skills</h3>
          <p>Focus on practical technical and development skills.</p>
        </div>
        <div className="feature-box">
          <h3>📊 Student Dashboard</h3>
          <p>Track your enrolled courses from one place.</p>
        </div>
      </div>
    </section>
  );
}
