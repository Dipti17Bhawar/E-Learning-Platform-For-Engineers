import { useEffect, useState } from "react";

import {
  ArrowLeft,
  BookOpen,
  FileText,
} from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import api from "../../api/axios";

import ResourceCard from "../../components/ResourceCard/ResourceCard";

import "./Notes.css";

export default function Notes() {
  const { subjectId } = useParams();
  const navigate = useNavigate();

  const [resources, setResources] = useState([]);
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const [subjectResponse, resourceResponse] =
          await Promise.all([
            api.get(`/subjects/${subjectId}`),

            api.get(
              `/resources/subject/${subjectId}`
            ),
          ]);

        // -----------------------------
        // SUBJECT
        // -----------------------------

        setSubject(
          subjectResponse.data.subject ||
            subjectResponse.data
        );

        // -----------------------------
        // ALL RESOURCES
        // -----------------------------

        const allResources =
          Array.isArray(resourceResponse.data)
            ? resourceResponse.data
            : resourceResponse.data.resources || [];

        // -----------------------------
        // ONLY NOTES
        // -----------------------------

        const notes = allResources.filter(
          (resource) =>
            resource.type === "notes"
        );

        setResources(notes);

      } catch (error) {
        console.error(
          "Error fetching notes:",
          error
        );

        setResources([]);
      } finally {
        setLoading(false);
      }
    };

    if (subjectId) {
      fetchNotes();
    }
  }, [subjectId]);

  return (
    <div className="notes-page">

      <div className="notes-container">

        {/* BACK BUTTON */}
        <button
          className="back-button"
          onClick={() =>
            navigate(
              `/subjects/${subjectId}/resources`
            )
          }
        >
          <ArrowLeft size={18} />
          Back to Resources
        </button>

        {/* HEADER */}
        <div className="notes-header">

          <div className="notes-header-icon">
            <BookOpen size={30} />
          </div>

          <div>
            <span>Study Material</span>

            <h1>
              {subject?.name || "Subject"} Notes
            </h1>

            <p>
              Read and download notes for this
              subject.
            </p>
          </div>

        </div>

        {/* CONTENT */}
        {loading ? (

          <div className="notes-message">
            <div className="loader"></div>
            <p>Loading notes...</p>
          </div>

        ) : resources.length === 0 ? (

          <div className="notes-message">

            <FileText size={45} />

            <h3>No notes available</h3>

            <p>
              Notes for this subject have not
              been added yet.
            </p>

          </div>

        ) : (

          <div className="notes-grid">

            {resources.map((resource) => (

              <ResourceCard
                key={resource._id}
                resource={resource}
              />

            ))}

          </div>

        )}

      </div>

    </div>
  );
}