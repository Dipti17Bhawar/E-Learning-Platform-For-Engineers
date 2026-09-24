import {
  BookOpen,
  Download,
  FileText,
  PlayCircle,
  ExternalLink,
} from "lucide-react";

import "./ResourceCard.css";

export default function ResourceCard({ resource }) {
  const getIcon = () => {
    if (resource.type === "video") {
      return <PlayCircle size={26} />;
    }

    if (resource.type === "qp") {
      return <FileText size={26} />;
    }

    return <BookOpen size={26} />;
  };

  const getTypeName = () => {
    if (resource.type === "video") {
      return "Video";
    }

    if (resource.type === "qp") {
      return "Question Paper";
    }

    return "Notes";
  };

  const handleDownload = () => {
    const link = document.createElement("a");

    link.href = resource.url;
    link.download = resource.title || "resource";

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
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="resource-view-button"
        >
          <ExternalLink size={17} />
          View
        </a>

        {resource.type !== "video" && (
          <button
            className="resource-download-button"
            onClick={handleDownload}
          >
            <Download size={17} />
            Download
          </button>
        )}

      </div>

    </div>
  );
}