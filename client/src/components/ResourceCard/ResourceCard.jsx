
import { useEffect, useState } from "react";
import {
  BookOpen,
  Download,
  FileText,
  ExternalLink,
  Bookmark,
  Check,
} from "lucide-react";

import api from "../../api/axios";
import "./ResourceCard.css";

export default function ResourceCard({ resource }) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [bookmarkError, setBookmarkError] = useState("");

  // GET FILE URL
  const getFileUrl = () => {
    if (!resource) return null;

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

    // Backend origin without /api
    const apiOrigin = api.defaults.baseURL.replace(/\/api\/?$/, "");

    // GridFS API path
    if (resource.fileUrl?.startsWith("/api/resources/file/")) {
      return `${apiOrigin}${resource.fileUrl}`;
    }

    // Uploaded file fallback
    if (resource.fileUrl?.startsWith("/uploads/")) {
      return `${apiOrigin}${resource.fileUrl}`;
    }

    return null;
  };

  const fileUrl = getFileUrl();

  // CHECK WHETHER RESOURCE IS ALREADY BOOKMARKED
  useEffect(() => {
    let active = true;

    const checkBookmark = async () => {
      if (!resource?._id) return;

      try {
        const response = await api.get("/bookmarks");
        const bookmarks = response.data.bookmarks || [];

        const saved = bookmarks.some((item) => {
          const savedId =
            typeof item === "string" ? item : item?._id;

          return String(savedId) === String(resource._id);
        });

        if (active) {
          setIsBookmarked(saved);
        }
      } catch (error) {
        console.error("Unable to fetch bookmarks:", error);
      }
    };

    checkBookmark();

    return () => {
      active = false;
    };
  }, [resource?._id]);

  // ADD OR REMOVE BOOKMARK
  const handleBookmark = async () => {
    if (!resource?._id || bookmarkLoading) return;

    try {
      setBookmarkLoading(true);
      setBookmarkError("");

      if (isBookmarked) {
        await api.delete(`/bookmarks/${resource._id}`);
        setIsBookmarked(false);
      } else {
        await api.post(`/bookmarks/${resource._id}`);
        setIsBookmarked(true);
      }
    } catch (error) {
      console.error("Bookmark error:", error);

      setBookmarkError(
        error.response?.data?.message ||
          "Unable to update bookmark. Please log in and try again."
      );
    } finally {
      setBookmarkLoading(false);
    }
  };

  // RESOURCE ICON
  const getIcon = () => {
    if (resource?.type === "question-paper") {
      return <FileText size={26} />;
    }

    return <BookOpen size={26} />;
  };

  // RESOURCE TYPE
  const getTypeName = () => {
    if (resource?.type === "question-paper") {
      return "Question Paper";
    }

    if (resource?.type === "study-material") {
      return "Study Material";
    }

    return "Notes";
  };

  // VIEW FILE
  const handleView = () => {
    if (!fileUrl) {
      alert("File is not available.");
      return;
    }

    window.open(fileUrl, "_blank", "noopener,noreferrer");
  };

  // DOWNLOAD FILE
  const handleDownload = () => {
    if (!fileUrl) {
      alert("File is not available.");
      return;
    }

    const separator = fileUrl.includes("?") ? "&" : "?";
    const downloadUrl = `${fileUrl}${separator}download=true`;

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download =
      resource.fileName || `${resource.title || "resource"}.pdf`;
    link.target = "_self";

    document.body.appendChild(link);
    link.click();
    link.remove();
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
        <h3>{resource?.title || "Untitled Resource"}</h3>

        <p>
          {resource?.description ||
            "Access this learning resource."}
        </p>

        {resource?.fileName && (
          <small>{resource.fileName}</small>
        )}

        {resource?.year && (
          <small>Year: {resource.year}</small>
        )}

        {resource?.semester && (
          <small>Semester: {resource.semester}</small>
        )}
      </div>

      {/* ACTION BUTTONS */}
      <div className="resource-card-actions">
        <button
          type="button"
          className="resource-view-button"
          onClick={handleView}
          disabled={!fileUrl}
        >
          <ExternalLink size={17} />
          View
        </button>

        <button
          type="button"
          className="resource-download-button"
          onClick={handleDownload}
          disabled={!fileUrl}
        >
          <Download size={17} />
          Download
        </button>

        {/* BOOKMARK BUTTON */}
        <button
          type="button"
          className={`resource-bookmark-button ${
            isBookmarked ? "is-bookmarked" : ""
          }`}
          onClick={handleBookmark}
          disabled={bookmarkLoading || !resource?._id}
          aria-pressed={isBookmarked}
        >
          {isBookmarked ? (
            <Check size={17} />
          ) : (
            <Bookmark size={17} />
          )}

          {bookmarkLoading
            ? "Saving..."
            : isBookmarked
              ? "Saved"
              : "Bookmark"}
        </button>
      </div>

      {/* ERROR */}
      {bookmarkError && (
        <p className="resource-bookmark-error" role="alert">
          {bookmarkError}
        </p>
      )}
    </div>
  );
}
