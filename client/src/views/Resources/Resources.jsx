import { BookOpen, FileText, GraduationCap } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import "./Resources.css";

export default function Resources() {
  const { subjectId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="resources-page">

      <div className="resources-container">

        {/* HEADER */}

        <div className="resources-header">
          <h1>Subject Resources</h1>

          <p>
            Access notes, question papers and study
            materials for this subject.
          </p>
        </div>

        {/* RESOURCE GRID */}

        <div className="resource-grid">

          {/* NOTES */}

          <div
            className="resource-card"
            onClick={() =>
              navigate(`/subjects/${subjectId}/resources/notes`)
            }
          >
            <div className="resource-icon">
              <BookOpen size={30} />
            </div>

            <h2>Notes</h2>

            <p>
              Read and download notes for this subject.
            </p>

            <button type="button">
              View Notes
            </button>
          </div>

          {/* QUESTION PAPERS */}

          <div
            className="resource-card"
            onClick={() =>
              navigate(
                `/subjects/${subjectId}/resources/question-papers`
              )
            }
          >
            <div className="resource-icon">
              <FileText size={30} />
            </div>

            <h2>Question Papers</h2>

            <p>
              View and download previous question papers.
            </p>

            <button type="button">
              View Question Papers
            </button>
          </div>

          {/* STUDY MATERIAL */}

          <div
            className="resource-card"
            onClick={() =>
              navigate(
                `/subjects/${subjectId}/resources/study-material`
              )
            }
          >
            <div className="resource-icon">
              <GraduationCap size={30} />
            </div>

            <h2>Study Materials</h2>

            <p>
              Access additional study materials for
              this subject.
            </p>

            <button type="button">
              View Study Materials
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}