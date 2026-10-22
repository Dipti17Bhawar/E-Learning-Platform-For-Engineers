
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

  // --------------------------------------------------
  // GET PDF URL
  // --------------------------------------------------

  const getFileUrl = (resource) => {
    if (!resource) {
      return null;
    }

    // GridFS file
    if (resource.fileId) {
      return `${api.defaults.baseURL}/resources/file/${resource.fileId}`;
    }

    // Full URL
    if (
      resource.fileUrl &&
      /^https?:\/\//i.test(resource.fileUrl)
    ) {
      return resource.fileUrl;
    }

    // GridFS API path
    if (
      resource.fileUrl &&
      resource.fileUrl.startsWith("/api/resources/file/")
    ) {
      const apiOrigin = (
        api.defaults.baseURL || ""
      ).replace(/\/api\/?$/, "");

      return `${apiOrigin}${resource.fileUrl}`;
    }

    // Older local uploads
    if (
      resource.fileUrl &&
      resource.fileUrl.startsWith("/uploads/")
    ) {
      const apiOrigin = (
        api.defaults.baseURL || ""
      ).replace(/\/api\/?$/, "");

      return `${apiOrigin}${resource.fileUrl}`;
    }

    return null;
  };

  // --------------------------------------------------
  // FETCH SUBJECT AND NOTES
  // --------------------------------------------------

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        setError("");

        if (!subjectId) {
          setError("Subject ID is missing.");
          return;
        }

        const [
          subjectResponse,
          resourceResponse,
        ] = await Promise.all([
          api.get(`/subjects/${subjectId}`),
          api.get(`/resources/subject/${subjectId}`),
        ]);

        // Subject details
        const subjectData =
          subjectResponse.data?.subject ||
          subjectResponse.data;

        setSubject(subjectData);

        // All resources
        const allResources = Array.isArray(
          resourceResponse.data
        )
          ? resourceResponse.data
          : resourceResponse.data?.resources || [];

        // Only notes
        const notes = allResources.filter(
          (resource) => resource.type === "notes"
        );

        setResources(notes);
      } catch (err) {
        console.error("Error fetching notes:", err);
        console.error("Status:", err.response?.status);
        console.error("Response:", err.response?.data);

        setError(
          err.response?.data?.message ||
            "Unable to load notes."
        );

        setResources([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [subjectId]);

  // --------------------------------------------------
  // VIEW PDF IN A NEW TAB
  // --------------------------------------------------

  const handleView = (resource) => {
    const fileUrl = getFileUrl(resource);

    if (!fileUrl) {
      alert("PDF file is not available.");
      return;
    }

    window.open(
      fileUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // --------------------------------------------------
  // DOWNLOAD PDF WITHOUT OPENING A NEW TAB
  // --------------------------------------------------

  const handleDownload = (resource) => {
    const fileUrl = getFileUrl(resource);

    if (!fileUrl) {
      alert("PDF file is not available.");
      return;
    }

    // Tell the backend to send the file as an attachment.
    const separator = fileUrl.includes("?") ? "&" : "?";
    const downloadUrl = `${fileUrl}${separator}download=true`;

    const link = document.createElement("a");

    link.href = downloadUrl;
    link.download =
      resource.fileName ||
      `${resource.title || "notes"}.pdf`;

    // No target="_blank": do not intentionally open a new tab.
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

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

  // --------------------------------------------------
  // ERROR
  // --------------------------------------------------

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

  // --------------------------------------------------
  // MAIN PAGE
  // --------------------------------------------------

  return (
    <div className="notes-page">
      <div className="notes-container">

        {/* Back Button */}
        <button
          className="back-button"
          onClick={() =>
            navigate(`/subject/${subjectId}`)
          }
        >
          <ArrowLeft size={18} />
          Back to Subject
        </button>

        {/* Header */}
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

        {/* No Notes */}
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
          /* Notes Grid */
          <div className="notes-grid">
            {resources.map((resource, index) => {
              const fileUrl = getFileUrl(resource);

              return (
                <div
                  className="note-card"
                  key={
                    resource._id ||
                    resource.id ||
                    index
                  }
                >
                  {/* Icon */}
                  <div className="note-icon">
                    <FileText size={28} />
                  </div>

                  {/* Content */}
                  <div className="note-content">
                    <h3>
                      {resource.title ||
                        `Unit ${index + 1}`}
                    </h3>

                    <p>
                      {resource.description ||
                        `Notes for Unit ${index + 1}`}
                    </p>

                    {resource.fileName && (
                      <small>
                        {resource.fileName}
                      </small>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="note-actions">
                    {/* View */}
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

                    {/* Download */}
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
