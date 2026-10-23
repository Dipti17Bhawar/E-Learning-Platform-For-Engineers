import { useEffect, useState } from "react";
import { ArrowLeft, BookOpen, FileText } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../api/axios";
import ResourceCard from "../../components/ResourceCard/ResourceCard";
import "./Notes.css";

export default function Notes() {
  const { subjectId } = useParams();
  const navigate = useNavigate();

  const [resources, setResources] = useState([]);
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const fetchNotes = async () => {
      try {
        setLoading(true);
        setError("");

        if (!subjectId) {
          setError("Subject ID is missing.");
          return;
        }

        const [subjectResponse, resourceResponse] =
          await Promise.all([
            api.get(`/subjects/${subjectId}`),
            api.get(`/resources/subject/${subjectId}`),
          ]);

        const subjectData =
          subjectResponse.data?.subject || subjectResponse.data;

        const responseData = resourceResponse.data;

        const allResources = Array.isArray(responseData)
          ? responseData
          : responseData?.resources || [];

        const notes = allResources.filter(
          (resource) => resource.type === "notes"
        );

        if (active) {
          setSubject(subjectData);
          setResources(notes);
        }
      } catch (err) {
        console.error("Error fetching notes:", err);

        if (active) {
          setError(
            err.response?.data?.message ||
              "Unable to load notes."
          );
          setResources([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchNotes();

    return () => {
      active = false;
    };
  }, [subjectId]);

  const goBack = () => {
    navigate(`/subject/${subjectId}`);
  };

  if (loading) {
    return (
      <div className="notes-page">
        <div className="notes-container">
          <div className="notes-message">
            <div className="loader" />
            <p>Loading notes...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="notes-page">
        <div className="notes-container">
          <button
            type="button"
            className="back-button"
            onClick={goBack}
          >
            <ArrowLeft size={18} />
            Back to Subject
          </button>

          <div className="notes-message">
            <FileText size={45} />
            <h3>Unable to load notes</h3>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="notes-page">
      <div className="notes-container">
        <button
          type="button"
          className="back-button"
          onClick={goBack}
        >
          <ArrowLeft size={18} />
          Back to Subject
        </button>

        <div className="notes-header">
          <div className="notes-header-icon">
            <BookOpen size={30} />
          </div>

          <div>
            <span>Study Material</span>
            <h1>{subject?.name || "Subject"} Notes</h1>
            <p>Read and download notes for this subject.</p>
          </div>
        </div>

        {resources.length === 0 ? (
          <div className="notes-message">
            <FileText size={45} />
            <h3>No notes available</h3>
            <p>
              Notes for this subject have not been added yet.
            </p>
          </div>
        ) : (
          <div className="notes-grid">
            {resources.map((resource, index) => (
              <ResourceCard
                key={resource._id || resource.id || index}
                resource={resource}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}