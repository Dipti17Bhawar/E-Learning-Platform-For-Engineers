import {
  BookOpen,
  Download,
  FileText,
  ExternalLink,
} from "lucide-react";

import "./ResourceCard.css";

export default function ResourceCard({ resource }) {
  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

  const getIcon = () => {
    if (resource.type === "question-paper") {
      return <FileText size={26} />;
    }

    return <BookOpen size={26} />;
  };

  const getTypeName = () => {
    if (resource.type === "question-paper") {
      return "Question Paper";
    }

    if (resource.type === "study-material") {
      return "Study Material";
    }

    return "Notes";
  };

  const fileUrl = resource.fileUrl?.startsWith("http")
    ? resource.fileUrl
    : `${API_URL}${resource.fileUrl}`;

  const handleDownload = () => {
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

      <div className="resource-card-header">

        <div className="resource-card-icon">
          {getIcon()}
        </div>

        <span className="resource-card-type">
          {getTypeName()}
        </span>

      </div>

      <div className="resource-card-content">

        <h3>{resource.title}</h3>

        <p>
          {resource.description ||
            "Access this learning resource."}
        </p>

      </div>

      <div className="resource-card-actions">

        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="resource-view-button"
        >
          <ExternalLink size={17} />
          View
        </a>

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