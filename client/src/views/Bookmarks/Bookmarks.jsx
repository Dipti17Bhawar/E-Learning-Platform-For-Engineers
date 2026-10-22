
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark, Trash2 } from "lucide-react";
import api from "../../api/axios.js";
import "./Bookmarks.css";

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await api.get("/bookmarks");
        const data = response.data;

        setBookmarks(
          Array.isArray(data)
            ? data
            : data.bookmarks || data.data || []
        );
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load bookmarks."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  const removeBookmark = async (resourceId) => {
    try {
      await api.delete(`/bookmarks/${resourceId}`);

      setBookmarks((previous) =>
        previous.filter((item) => item._id !== resourceId)
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to remove bookmark."
      );
    }
  };

  if (loading) {
    return <p className="bookmarks-message">Loading bookmarks...</p>;
  }

  return (
    <section className="bookmarks-page">
      <div className="bookmarks-heading">
        <Bookmark size={28} />
        <div>
          <h1>My Bookmarks</h1>
          <p>Your saved learning resources</p>
        </div>
      </div>

      {error && <p className="bookmarks-error">{error}</p>}

      {bookmarks.length === 0 ? (
        <div className="bookmarks-empty">
          <Bookmark size={42} />
          <h2>No bookmarks yet</h2>
          <p>Save notes and question papers to find them here.</p>
          <Link to="/dashboard">Explore resources</Link>
        </div>
      ) : (
        <div className="bookmarks-grid">
          {bookmarks.map((resource) => (
            <article
              className="bookmark-card"
              key={resource._id}
            >
              <div className="bookmark-card-icon">
                <Bookmark size={22} />
              </div>

              <h2>
                {resource.title ||
                  resource.name ||
                  resource.originalName ||
                  "Learning Resource"}
              </h2>

              <p>
                {resource.type || "Study material"}
              </p>

              <div className="bookmark-card-actions">
                {resource.fileUrl && (
                  <a
                    href={resource.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View / Download
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => removeBookmark(resource._id)}
                  aria-label="Remove bookmark"
                >
                  <Trash2 size={16} />
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
