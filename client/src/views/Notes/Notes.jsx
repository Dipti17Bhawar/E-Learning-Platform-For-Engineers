import { useEffect, useState } from "react";

import {
  ArrowLeft,
  BookOpen,
  FileText,
  Eye,
  Download,
} from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import api from "../../api/axios";

import "./Notes.css";

export default function Notes() {
  const { subjectId } = useParams();
  const navigate = useNavigate();

  const [resources, setResources] = useState([]);
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================
  // GET SUBJECT + NOTES
  // =========================================
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        setError("");

        const [subjectResponse, resourceResponse] =
          await Promise.all([
            api.get(`/subjects/${subjectId}`),
            api.get(`/resources/subject/${subjectId}`),
          ]);

        // SUBJECT
        setSubject(
          subjectResponse.data.subject ||
            subjectResponse.data
        );

        // ALL RESOURCES
        const allResources =
          Array.isArray(resourceResponse.data)
            ? resourceResponse.data
            : resourceResponse.data.resources || [];

        // ONLY NOTES
        const notes = allResources.filter(
          (resource) => resource.type === "notes"
        );

        setResources(notes);
      } catch (error) {
        console.error("Error fetching notes:", error);

        setError(
          error.response?.data?.message ||
            "Unable to load notes."
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

  // =========================================
  // GET COMPLETE PDF URL
  // =========================================
  const getFileUrl = (resource) => {
    if (!resource?.fileUrl) {
      return null;
    }

    // Already a complete URL
    if (
      resource.fileUrl.startsWith("http://") ||
      resource.fileUrl.startsWith("https://")
    ) {
      return resource.fileUrl;
    }

    // Backend Render URL
    return `https://e-learning-platform-for-engineers-1.onrender.com${resource.fileUrl}`;
  };

  // =========================================
  // VIEW PDF
  // =========================================
  const handleView = (resource) => {
    const fileUrl = getFileUrl(resource);

    if (!fileUrl) {
      alert("PDF file is not available.");
      return;
    }

    console.log("Opening PDF:", fileUrl);

    window.open(
      fileUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // =========================================
  // DOWNLOAD PDF
  // =========================================
  const handleDownload = (resource) => {
    const fileUrl = getFileUrl(resource);

    if (!fileUrl) {
      alert("PDF file is not available.");
      return;
    }

    const link = document.createElement("a");

    link.href = fileUrl;
    link.download =
      resource.fileName ||
      resource.title ||
      "notes.pdf";

    link.target = "_blank";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // =========================================
  // LOADING
  // =========================================
  if (loading) {
    return (
      <div className="notes-page">
        <div className="notes-container">
          <div className="notes-message">
            <div className="loader"></div>
            <p>Loading notes...</p>
          </div>
        </div>
      </div>
    );
  }

  // =========================================
  // ERROR
  // =========================================
  if (error) {
    return (
      <div className="notes-page">
        <div className="notes-container">
          <button
            className="back-button"
            onClick={() =>
              navigate(`/subject/${subjectId}`)
            }
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

  // =========================================
  // PAGE
  // =========================================
  return (
    <div className="notes-page">
      <div className="notes-container">

        {/* BACK BUTTON */}
        <button
          className="back-button"
          onClick={() =>
            navigate(`/subject/${subjectId}`)
          }
        >
          <ArrowLeft size={18} />
          Back to Subject
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
              Read and download notes for this subject.
            </p>
          </div>
        </div>

        {/* NOTES */}
        {resources.length === 0 ? (
          <div className="notes-message">
            <FileText size={45} />

            <h3>No notes available</h3>

            <p>
              Notes for this subject have not been
              added yet.
            </p>
          </div>
        ) : (
          <div className="notes-grid">
            {resources.map((resource, index) => {
              const fileUrl = getFileUrl(resource);

              return (
                <div
                  className="note-card"
                  key={resource._id}
                >
                  {/* ICON */}
                  <div className="note-icon">
                    <FileText size={28} />
                  </div>

                  {/* CONTENT */}
                  <div className="note-content">
                    <h3>
                      {resource.title ||
                        `Unit ${index + 1}`}
                    </h3>

                    <p>
                      {resource.description ||
                        `Notes for Unit ${
                          index + 1
                        }`}
                    </p>

                    {resource.fileName && (
                      <small>
                        {resource.fileName}
                      </small>
                    )}
                  </div>

                  {/* ACTIONS */}
                  <div className="note-actions">
                    <button
                      type="button"
                      className="view-button"
                      onClick={() =>
                        handleView(resource)
                      }
                      disabled={!fileUrl}
                    >
                      <Eye size={17} />
                      View
                    </button>

                    <button
                      type="button"
                      className="download-button"
                      onClick={() =>
                        handleDownload(resource)
                      }
                      disabled={!fileUrl}
                    >
                      <Download size={17} />
                      Download
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}