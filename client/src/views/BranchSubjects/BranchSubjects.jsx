import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  GraduationCap,
  Search,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../api/axios";
import "./BranchSubjects.css";

export default function BranchSubjects() {
  const { code } = useParams();
  const navigate = useNavigate();

  const [branch, setBranch] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBranch = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/branches/code/${code}`
        );

        console.log("Branch response:", response.data);

        setBranch(response.data.branch || null);
        setSubjects(response.data.subjects || []);
      } catch (err) {
        console.error("Branch fetch error:", err);

        setError(
          err.response?.data?.message ||
            "Unable to fetch branch"
        );
      } finally {
        setLoading(false);
      }
    };

    if (code) {
      fetchBranch();
    }
  }, [code]);

  /* -------------------------
     LOADING
  ------------------------- */

  if (loading) {
    return (
      <div className="branch-subjects-page">
        <div className="branch-subjects-container">
          <div className="page-loading">
            <BookOpen size={40} />
            <h2>Loading subjects...</h2>
            <p>
              Please wait while we load the subjects.
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------
     ERROR
  ------------------------- */

  if (error) {
    return (
      <div className="branch-subjects-page">
        <div className="branch-subjects-container">
          <div className="page-error">
            <h2>Unable to load branch</h2>
            <p>{error}</p>

            <button
              className="error-back-button"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft size={18} />
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------
     BRANCH NOT FOUND
  ------------------------- */

  if (!branch) {
    return (
      <div className="branch-subjects-page">
        <div className="branch-subjects-container">
          <div className="page-error">
            <h2>Branch not found</h2>
            <p>
              The requested engineering branch could not
              be found.
            </p>

            <button
              className="error-back-button"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft size={18} />
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------
     SEARCH SUBJECTS
  ------------------------- */

  const filteredSubjects = subjects.filter((subject) => {
    const searchText = search.toLowerCase().trim();

    if (!searchText) {
      return true;
    }

    return (
      subject.name
        ?.toLowerCase()
        .includes(searchText) ||
      subject.code
        ?.toLowerCase()
        .includes(searchText) ||
      subject.description
        ?.toLowerCase()
        .includes(searchText)
    );
  });

  return (
    <div className="branch-subjects-page">

      <div className="branch-subjects-container">

        {/* =========================
            BACK TO DASHBOARD
        ========================= */}

        <button
          className="back-dashboard-button"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={18} />
          <span>Back to Dashboard</span>
        </button>

        {/* =========================
            BRANCH HEADER
        ========================= */}

        <div className="branch-header">

          <div className="branch-header-icon">
            <BookOpen size={38} />
          </div>

          <div className="branch-header-content">

            <h1>{branch.name}</h1>

            <p>
              {branch.description ||
                "Explore all subjects available in this branch."}
            </p>

          </div>

        </div>

        {/* =========================
            SEARCH
        ========================= */}

        <div className="subject-search-box">

          <Search
            size={21}
            className="search-icon"
          />

          <input
            type="text"
            placeholder="Search subjects..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        {/* =========================
            SUBJECT SECTION
        ========================= */}

        <section className="subjects-section">

          {filteredSubjects.length > 0 ? (
            <div className="subjects-grid">

              {filteredSubjects.map((subject) => (

                <div
                  className="subject-card"
                  key={subject._id}
                >

                  {/* CARD TOP */}

                  <div className="subject-card-top">

                    <div className="subject-icon">
                      <GraduationCap size={28} />
                    </div>

                    <span className="subject-badge">
                      Subject
                    </span>

                  </div>

                  {/* CARD CONTENT */}

                  <div className="subject-card-content">

                    <h3>{subject.name}</h3>

                    {subject.description && (
                      <p>
                        {subject.description}
                      </p>
                    )}

                  </div>

                  {/* VIEW BUTTON */}

                  <button
                    className="view-subject-button"
                    onClick={() =>
                      navigate(
                        `/subject/${subject._id}`
                      )
                    }
                  >
                    <span>View Subject</span>

                    <ArrowRight size={19} />
                  </button>

                </div>

              ))}

            </div>
          ) : (
            <div className="no-subjects">

              <BookOpen size={42} />

              <h3>
                {search
                  ? "No subjects found"
                  : "No subjects available"}
              </h3>

              <p>
                {search
                  ? "Try searching with another subject name or code."
                  : "Subjects for this branch have not been added yet."}
              </p>

            </div>
          )}

        </section>

      </div>

    </div>
  );
}