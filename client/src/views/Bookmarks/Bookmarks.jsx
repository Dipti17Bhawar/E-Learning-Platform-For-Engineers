import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bookmark,
  Trash2,
  ExternalLink,
  Download,
  FileText,
} from "lucide-react";

import api from "../../api/axios.js";
import "./Bookmarks.css";

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState(null);

  const getFileUrl = useCallback((resource) => {
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
  }, []);

  const fetchBookmarks = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/bookmarks");
      const data = response.data;

      const items = Array.isArray(data)
        ? data
        : data?.bookmarks || data?.data || [];

      // Support resources returned directly or inside a resource field.
      const normalized = items
        .map((item) => item?.resource || item)
        .filter(
          (item) =>
            item &&
            typeof item === "object" &&
            (item._id || item.id)
        );

      setBookmarks(normalized);
    } catch (err) {
      console.error("Error fetching bookmarks:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load bookmarks. Please log in and try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const removeBookmark = async (resourceId) => {
    if (!resourceId || removingId) return;

    try {
      setRemovingId(resourceId);
      setError("");

      await api.delete(`/bookmarks/${resourceId}`);

      setBookmarks((previous) =>
        previous.filter(
          (item) => String(item._id || item.id) !== String(resourceId)
        )
      );
    } catch (err) {
      console.error("Error removing bookmark:", err);

      setError(
        err.response?.data?.message ||
          "Unable to remove bookmark. Please try again."
      );
    } finally {
      setRemovingId(null);
    }
  };

  const handleView = (resource) => {
    const fileUrl = getFileUrl(resource);

    if (!fileUrl) {
      setError("The file for this resource is not available.");
      return;
    }

    window.open(fileUrl, "_blank", "noopener,noreferrer");
  };

  const handleDownload = (resource) => {
    const fileUrl = getFileUrl(resource);

    if (!fileUrl) {
      setError("The file for this resource is not available.");
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

  if (loading) {
    return (
      <section className="bookmarks-page">
        <div className="bookmarks-message">
          Loading your bookmarks...
        </div>
      </section>
    );
  }

  return (
    <section className="bookmarks-page">
      <div className="bookmarks-container">
        <header className="bookmarks-heading">
          <div className="bookmarks-heading-icon">
            <Bookmark size={27} />
          </div>

          <div>
            <h1>My Bookmarks</h1>
            <p>Your saved learning resources</p>
          </div>
        </header>

        {error && (
          <div className="bookmarks-error" role="alert">
            {error}
          </div>
        )}

        {bookmarks.length === 0 ? (
          <div className="bookmarks-empty">
            <Bookmark size={44} />

            <h2>No bookmarks yet</h2>

            <p>
              Save notes and question papers using the Bookmark
              button. Your saved resources will appear here.
            </p>

            <Link to="/dashboard" className="bookmarks-explore">
              Explore resources
            </Link>
          </div>
        ) : (
          <div className="bookmarks-grid">
            {bookmarks.map((resource) => {
              const resourceId = resource._id || resource.id;

              return (
                <article
                  className="bookmark-card"
                  key={resourceId}
                >
                  <div className="bookmark-card-icon">
                    <FileText size={25} />
                  </div>

                  <h2>
                    {resource.title ||
                      resource.name ||
                      resource.originalName ||
                      "Learning Resource"}
                  </h2>

                  <p className="bookmark-card-type">
                    {resource.type === "question-paper"
                      ? "Question Paper"
                      : resource.type === "notes"
                        ? "Notes"
                        : resource.type === "study-material"
                          ? "Study Material"
                          : "Learning Resource"}
                  </p>

                  {resource.description && (
                    <p className="bookmark-card-description">
                      {resource.description}
                    </p>
                  )}

                  <div className="bookmark-card-actions">
                    <button
                      type="button"
                      onClick={() => handleView(resource)}
                      disabled={!getFileUrl(resource)}
                    >
                      <ExternalLink size={16} />
                      View
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDownload(resource)}
                      disabled={!getFileUrl(resource)}
                    >
                      <Download size={16} />
                      Download
                    </button>

                    <button
                      type="button"
                      className="bookmark-remove-button"
                      onClick={() => removeBookmark(resourceId)}
                      disabled={removingId !== null}
                    >
                      <Trash2 size={16} />
                      {String(removingId) === String(resourceId)
                        ? "Removing..."
                        : "Remove"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}