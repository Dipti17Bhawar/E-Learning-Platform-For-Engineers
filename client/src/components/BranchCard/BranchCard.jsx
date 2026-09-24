import { ArrowRight, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./BranchCard.css";

export default function BranchCard({ branch }) {
  const navigate = useNavigate();

  const handleViewSubjects = () => {
    navigate(`/branches/${branch._id}/subjects`);
  };

  return (
    <div className="branch-card">
      <div className="branch-card-icon">
        <BookOpen size={28} />
      </div>

      <div className="branch-card-content">
        <h3>{branch.name}</h3>

        <p>
          {branch.description ||
            `Explore subjects and learning resources for ${branch.name}.`}
        </p>

        <button
          className="branch-card-button"
          onClick={handleViewSubjects}
        >
          View Subjects
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}