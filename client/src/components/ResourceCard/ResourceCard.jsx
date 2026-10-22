import {
  BookOpen,
  Download,
  FileText,
  ExternalLink,
} from "lucide-react";

import api from "../../api/axios";

import "./ResourceCard.css";

export default function ResourceCard({ resource }) {
  // --------------------------------------------------
  // GET PDF URL
  // --------------------------------------------------

  const getFileUrl = () => {
    if (!resource) {
      return null;
    }

    // NEW GRIDFS FILE
    if (resource.fileId) {
      return `${api.defaults.baseURL}/resources/file/${resource.fileId}`;
    }

    // FULL URL
    if (
      resource.fileUrl &&
      (resource.fileUrl.startsWith("http://") ||
        resource.fileUrl.startsWith("https://"))
    ) {
      return resource.fileUrl;
    }

    // GRIDFS API PATH
    if (
      resource.fileUrl &&
      resource.fileUrl.startsWith("/api/resources/file/")
    ) {
      const apiOrigin = api.defaults.baseURL.replace(/\/api\/?$/, "");

      return `${apiOrigin}${resource.fileUrl}`;
    }

    // OLD LOCAL UPLOADS FALLBACK
    if (
      resource.fileUrl &&
      resource.fileUrl.startsWith("/uploads/")
    ) {
      const apiOrigin = api.defaults.baseURL.replace(/\/api\/?$/, "");

      return `${apiOrigin}${resource.fileUrl}`;
    }

    return null;
  };

  const fileUrl = getFileUrl();

  // --------------------------------------------------
  // ICON
  // --------------------------------------------------

  const getIcon = () => {
    if (resource?.type === "question-paper") {
      return <FileText size={26} />;
    }

    return <BookOpen size={26} />;
  };

  // --------------------------------------------------
  // TYPE NAME
  // --------------------------------------------------

  const getTypeName = () => {
    if (resource?.type === "question-paper") {
      return "Question Paper";
    }

    if (resource?.type === "study-material") {
      return "Study Material";
    }

    return "Notes";
  };

  // --------------------------------------------------
  // VIEW PDF IN A NEW TAB
  // --------------------------------------------------

  const handleView = () => {
    if (!fileUrl) {
      alert("PDF file is not available.");
      return;
    }

    window.open(fileUrl, "_blank", "noopener,noreferrer");
  };

  // --------------------------------------------------
  // DOWNLOAD PDF WITHOUT OPENING A NEW TAB
  // --------------------------------------------------

  const handleDownload = () => {
    if (!fileUrl) {
      alert("PDF file is not available.");
      return;
    }

    // Ask the backend to send the file as an attachment.
    const separator = fileUrl.includes("?") ? "&" : "?";
    const downloadUrl = `${fileUrl}${separator}download=true`;

    // Create a temporary download link.
    const link = document.createElement("a");

    link.href = downloadUrl;
    link.download =
      resource.fileName ||
      `${resource.title || "resource"}.pdf`;

    // Do not open another tab.
    link.target = "_self";

    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

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
        <h3>
          {resource?.title || "Untitled Resource"}
        </h3>

        <p>
          {resource?.description ||
            "Access this learning resource."}
        </p>

        {/* FILE NAME */}

        {resource?.fileName && (
          <small>{resource.fileName}</small>
        )}

        {/* YEAR */}

        {resource?.year && (
          <small>Year: {resource.year}</small>
        )}

        {/* SEMESTER */}

        {resource?.semester && (
          <small>Semester: {resource.semester}</small>
        )}
      </div>

      {/* ACTIONS */}

      <div className="resource-card-actions">

        {/* VIEW */}

        <button
          type="button"
          className="resource-view-button"
          onClick={handleView}
          disabled={!fileUrl}
        >
          <ExternalLink size={17} />
          View
        </button>

        {/* DOWNLOAD */}

        <button
          type="button"
          className="resource-download-button"
          onClick={handleDownload}
          disabled={!fileUrl}
        >
          <Download size={17} />
          Download
        </button>

      </div>
    </div>
  );
}