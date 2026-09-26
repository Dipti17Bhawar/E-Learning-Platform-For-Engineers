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

    // ------------------------------------------------
    // NEW GRIDFS FILE
    // ------------------------------------------------
    if (resource.fileId) {
      return `${api.defaults.baseURL}/resources/file/${resource.fileId}`;
    }

    // ------------------------------------------------
    // FULL URL
    // ------------------------------------------------
    if (
      resource.fileUrl &&
      (resource.fileUrl.startsWith("http://") ||
        resource.fileUrl.startsWith("https://"))
    ) {
      return resource.fileUrl;
    }

    // ------------------------------------------------
    // GRIDFS API PATH
    // Example:
    // /api/resources/file/6ab7816df24910f54d574f8a
    // ------------------------------------------------
    if (
      resource.fileUrl &&
      resource.fileUrl.startsWith("/api/resources/file/")
    ) {
      const apiOrigin = api.defaults.baseURL.replace(/\/api\/?$/, "");

      return `${apiOrigin}${resource.fileUrl}`;
    }

    // ------------------------------------------------
    // OLD LOCAL UPLOADS FALLBACK
    // ------------------------------------------------
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
    if (resource.type === "question-paper") {
      return <FileText size={26} />;
    }

    return <BookOpen size={26} />;
  };

  // --------------------------------------------------
  // TYPE NAME
  // --------------------------------------------------
  const getTypeName = () => {
    if (resource.type === "question-paper") {
      return "Question Paper";
    }

    return "Notes";
  };

  // --------------------------------------------------
  // VIEW
  // --------------------------------------------------
  const handleView = () => {
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

  // --------------------------------------------------
  // DOWNLOAD
  // --------------------------------------------------
  const handleDownload = () => {
    if (!fileUrl) {
      alert("PDF file is not available.");
      return;
    }

    const link = document.createElement("a");

    link.href = fileUrl;

    link.download =
      resource.fileName ||
      resource.title ||
      "resource.pdf";

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

        {resource.fileName && (
          <small>
            {resource.fileName}
          </small>
        )}

        {resource.year && (
          <small>
            Year: {resource.year}
          </small>
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