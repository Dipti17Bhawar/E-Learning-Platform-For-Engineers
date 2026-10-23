import { useEffect, useState } from "react";
import {
  BookOpen,
  Download,
  FileText,
  ExternalLink,
  Bookmark,
  Check,
} from "lucide-react";

import api from "../../api/axios.js";
import "./ResourceCard.css";

export default function ResourceCard({ resource }) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [bookmarkError, setBookmarkError] = useState("");

  const resourceId = resource?._id || resource?.id;

  const getFileUrl = () => {
    if (!resource) return null;

    const baseURL = api.defaults.baseURL || "";
    const apiOrigin = baseURL.replace(/\/api\/?$/, "");

    if (resource.fileId) {
      return `${baseURL}/resources/file/${resource.fileId}`;
    }

    if (
      typeof resource.fileUrl === "string" &&
      /^https?:\/\//i.test(resource.fileUrl)
    ) {
      return resource.fileUrl;
    }

    if (resource.fileUrl?.startsWith("/api/")) {
      return `${apiOrigin}${resource.fileUrl}`;
    }

    if (resource.fileUrl?.startsWith("/uploads/")) {
      return `${apiOrigin}${resource.fileUrl}`;
    }

    return null;
  };

  const fileUrl = getFileUrl();

  // Check whether this resource is already bookmarked.
  useEffect(() => {
    let active = true;

    const checkBookmark = async () => {
      if (!resourceId) return;

      try {
        const response = await api.get("/bookmarks");

        const data = response.data;
        const bookmarks = Array.isArray(data)
          ? data
          : data?.bookmarks || data?.data || [];

        const saved = bookmarks.some((item) => {
          const savedResourceId =
            typeof item === "string"
              ? item
              : item?._id || item?.resource?._id || item?.resource;

          return String(savedResourceId) === String(resourceId);
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
  }, [resourceId]);

  // Add or remove a bookmark.
  const handleBookmark = async () => {
    if (!resourceId || bookmarkLoading) return;

    const previousState = isBookmarked;

    try {
      setBookmarkLoading(true);
      setBookmarkError("");

      // Update the UI immediately.
      setIsBookmarked(!previousState);

      if (previousState) {
        await api.delete(`/bookmarks/${resourceId}`);
      } else {
        await api.post(`/bookmarks/${resourceId}`);
      }
    } catch (error) {
      console.error("Bookmark error:", error);

      // Restore the original state if the request fails.
      setIsBookmarked(previousState);

      setBookmarkError(
        error.response?.data?.message ||
          "Unable to update bookmark. Please log in and try again."
      );
    } finally {
      setBookmarkLoading(false);
    }
  };

  const getIcon = () => {
    if (resource?.type === "question-paper") {
      return <FileText size={26} />;
    }

    return <BookOpen size={26} />;
  };

  const getTypeName = () => {
    if (resource?.type === "question-paper") {
      return "Question Paper";
    }

    if (resource?.type === "study-material") {
      return "Study Material";
    }

    return "Notes";
  };

  const handleView = () => {
    if (!fileUrl) {
      alert("File is not available.");
      return;
    }

    window.open(fileUrl, "_blank", "noopener,noreferrer");
  };

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

    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <article className="resource-card">
      <div className="resource-card-header">
        <div className="resource-card-icon">{getIcon()}</div>

        <span className="resource-card-type">{getTypeName()}</span>
      </div>

      <div className="resource-card-content">
        <h3>{resource?.title || "Untitled Resource"}</h3>

        <p>
          {resource?.description || "Access this learning resource."}
        </p>

        {resource?.fileName && <small>{resource.fileName}</small>}

        {resource?.year && <small>Year: {resource.year}</small>}

        {resource?.semester && (
          <small>Semester: {resource.semester}</small>
        )}
      </div>

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

        <button
          type="button"
          className={`resource-bookmark-button ${
            isBookmarked ? "is-bookmarked" : ""
          }`}
          onClick={handleBookmark}
          disabled={bookmarkLoading || !resourceId}
          aria-pressed={isBookmarked}
          aria-label={
            isBookmarked ? "Remove bookmark" : "Save bookmark"
          }
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

      {bookmarkError && (
        <p className="resource-bookmark-error" role="alert">
          {bookmarkError}
        </p>
      )}
    </article>
  );
}