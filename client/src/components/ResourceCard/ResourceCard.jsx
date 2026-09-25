import {
  BookOpen,
  Download,
  FileText,
  ExternalLink,
  GraduationCap,
} from "lucide-react";

import "./ResourceCard.css";

export default function ResourceCard({ resource }) {
  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

  // --------------------------------
  // RESOURCE TYPE ICON
  // --------------------------------

  const getIcon = () => {
    if (resource.type === "question-paper") {
      return <FileText size={26} />;
    }

    if (resource.type === "study-material") {
      return <GraduationCap size={26} />;
    }

    return <BookOpen size={26} />;
  };

  // --------------------------------
  // RESOURCE TYPE NAME
  // --------------------------------

  const getTypeName = () => {
    if (resource.type === "question-paper") {
      return "Question Paper";
    }

    if (resource.type === "study-material") {
      return "Study Material";
    }

    return "Notes";
  };

  // --------------------------------
  // PDF URL
  // --------------------------------

  const fileUrl = resource.fileUrl?.startsWith("http")
    ? resource.fileUrl
    : `${API_URL}${resource.fileUrl}`;

  // --------------------------------
  // DOWNLOAD
  // --------------------------------

  const handleDownload = () => {
    const link = document.createElement("a");

    link.href = fileUrl;
    link.download =
      resource.fileName ||
      resource.title ||
      "resource.pdf";

    link.target = "_blank";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="resource-card">

      {/* HEADER */}

      <div className="resource-card-header">

        <div className="resource-card-icon">
          {getIcon()}
        </div>

        <span className="resource-card-type">
          {getTypeName()}
        </span>

      </div>

      {/* CONTENT */}

      <div className="resource-card-content">

        <h3>{resource.title}</h3>

        <p>
          {resource.description ||
            "Access this learning resource."}
        </p>

        {/* OPTIONAL DETAILS */}

        {(resource.year || resource.semester) && (
          <div className="resource-meta">

            {resource.year && (
              <span>
                Year: {resource.year}
              </span>
            )}

            {resource.semester && (
              <span>
                Semester: {resource.semester}
              </span>
            )}

          </div>
        )}

      </div>

      {/* ACTIONS */}

      <div className="resource-card-actions">

        {/* VIEW PDF */}

        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="resource-view-button"
        >
          <ExternalLink size={17} />
          View
        </a>

        {/* DOWNLOAD PDF */}

        <button
          type="button"
          className="resource-download-button"
          onClick={handleDownload}
        >
          <Download size={17} />
          Download
        </button>

      </div>

    </div>
  );
}