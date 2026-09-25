import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import "./Subject.css";

export default function Subject() {
  const { subjectId } = useParams();
  const navigate = useNavigate();

  const [subject, setSubject] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubjectData();
  }, [subjectId]);

  const fetchSubjectData = async () => {
    try {
      setLoading(true);

      // Get subject
      const subjectResponse = await api.get(
        `/subjects/${subjectId}`
      );

      setSubject(
        subjectResponse.data.subject
      );

      // Get resources
      const resourceResponse = await api.get(
        `/resources/subject/${subjectId}`
      );

      setResources(
        resourceResponse.data.resources || []
      );
    } catch (error) {
      console.error(
        "Failed to load subject resources:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const notes = resources.filter(
    (resource) => resource.type === "notes"
  );

  const questionPapers = resources.filter(
    (resource) =>
      resource.type === "question-paper"
  );

  const studyMaterials = resources.filter(
    (resource) =>
      resource.type === "study-material"
  );

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="subject-page">

      <div className="subject-container">

        {subject && (
          <>
            <h1>{subject.name}</h1>

            <p>
              {subject.description}
            </p>
          </>
        )}

        {/* NOTES */}
        <section className="resource-section">

          <div className="resource-section-header">
            <h2>Notes</h2>

            <button
              onClick={() =>
                navigate(
                  `/subject/${subjectId}/notes`
                )
              }
            >
              View All Notes
            </button>
          </div>

          <div className="resource-grid">

            {notes.length === 0 ? (
              <p>No notes available.</p>
            ) : (
              notes.slice(0, 3).map((resource) => (
                <div
                  className="resource-card"
                  key={resource._id}
                >
                  <h3>
                    {resource.title}
                  </h3>

                  <p>
                    {resource.description}
                  </p>
                </div>
              ))
            )}

          </div>
        </section>


        {/* QUESTION PAPERS */}
        <section className="resource-section">

          <div className="resource-section-header">
            <h2>Question Papers</h2>

            <button
              onClick={() =>
                navigate(
                  `/subject/${subjectId}/question-papers`
                )
              }
            >
              View All QPs
            </button>
          </div>

          <div className="resource-grid">

            {questionPapers.length === 0 ? (
              <p>No question papers available.</p>
            ) : (
              questionPapers
                .slice(0, 3)
                .map((resource) => (
                  <div
                    className="resource-card"
                    key={resource._id}
                  >
                    <h3>
                      {resource.title}
                    </h3>

                    <p>
                      {resource.year}
                    </p>
                  </div>
                ))
            )}

          </div>
        </section>


        {/* STUDY MATERIAL */}
        <section className="resource-section">

          <div className="resource-section-header">
            <h2>Study Materials</h2>

            <button
              onClick={() =>
                navigate(
                  `/subject/${subjectId}/resources`
                )
              }
            >
              View All Materials
            </button>
          </div>

          <div className="resource-grid">

            {studyMaterials.length === 0 ? (
              <p>
                No study materials available.
              </p>
            ) : (
              studyMaterials
                .slice(0, 3)
                .map((resource) => (
                  <div
                    className="resource-card"
                    key={resource._id}
                  >
                    <h3>
                      {resource.title}
                    </h3>
                  </div>
                ))
            )}

          </div>
        </section>

      </div>
    </div>
  );
}