import { ArrowRight, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./SubjectCard.css";

export default function SubjectCard({ subject }) {
  const navigate = useNavigate();

  const handleViewSubject = () => {
    navigate(`/subjects/${subject._id}`);
  };

  return (
    <div className="subject-card">
      <div className="subject-card-top">
        <div className="subject-card-icon">
          <GraduationCap size={26} />
        </div>

        <span className="subject-card-badge">
          Subject
        </span>
      </div>

      <div className="subject-card-content">
        <h3>{subject.name}</h3>

        <p>
          {subject.description ||
            "Access study material, notes, question papers and videos."}
        </p>
      </div>

      <button
        className="subject-card-button"
        onClick={handleViewSubject}
      >
        View Subject
        <ArrowRight size={18} />
      </button>
    </div>
  );
}