import { useEffect, useState } from "react";

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  FileText,
  GraduationCap,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";

import api from "../../api/axios";

import "./Subject.css";

export default function Subject() {
  const { subjectId } = useParams();
  const navigate = useNavigate();

  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSubject = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/subjects/${subjectId}`
        );

        setSubject(
          response.data.subject ||
            response.data
        );
      } catch (err) {
        console.error(
          "Error fetching subject:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Unable to load subject."
        );
      } finally {
        setLoading(false);
      }
    };

    if (subjectId) {
      fetchSubject();
    }
  }, [subjectId]);

  /* ================================
     LOADING
  ================================= */

  if (loading) {
    return (
      <div className="subject-page">
        <div className="subject-loading">
          <div className="loader"></div>
          <p>Loading subject...</p>
        </div>
      </div>
    );
  }

  /* ================================
     ERROR
  ================================= */

  if (error || !subject) {
    return (
      <div className="subject-page">
        <div className="subject-error">

          <h2>Subject not found</h2>

          <p>
            {error ||
              "The requested subject does not exist."}
          </p>

          <button
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>

        </div>
      </div>
    );
  }

  /* ================================
     SUBJECT PAGE
  ================================= */

  return (
    <div className="subject-page">

      <div className="subject-container">

        {/* BACK BUTTON */}

        <button
          className="back-button"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {/* SUBJECT HERO */}

        <div className="subject-hero">

          <div className="subject-hero-icon">
            <BookOpen size={38} />
          </div>

          <div className="subject-hero-content">

            <span className="subject-label">
              Subject
            </span>

            <h1>{subject.name}</h1>

            <p>
              {subject.description ||
                "Learn this subject with notes, question papers and study materials."}
            </p>

          </div>

        </div>

        {/* RESOURCES INTRO */}

        <div className="resources-intro">

          <div>

            <h2>
              Learning Resources
            </h2>

            <p>
              Access all study materials
              related to this subject.
            </p>

          </div>

          <button
            className="resources-main-button"
            onClick={() =>
              navigate(
                `/subjects/${subjectId}/resources`
              )
            }
          >
            View All Resources

            <ArrowRight size={18} />

          </button>

        </div>

        {/* RESOURCE PREVIEW */}

        <div className="subject-resource-preview">

          {/* NOTES */}

          <div className="preview-card">

            <div className="preview-icon notes-icon">
              <FileText size={25} />
            </div>

            <h3>
              Notes
            </h3>

            <p>
              Study notes and learning
              materials for this subject.
            </p>

          </div>

          {/* QUESTION PAPERS */}

          <div className="preview-card">

            <div className="preview-icon qp-icon">
              <FileText size={25} />
            </div>

            <h3>
              Question Papers
            </h3>

            <p>
              Previous year examination
              papers for practice.
            </p>

          </div>

          {/* STUDY MATERIAL */}

          <div className="preview-card">

            <div className="preview-icon study-material-icon">
              <GraduationCap size={25} />
            </div>

            <h3>
              Study Materials
            </h3>

            <p>
              Additional study materials
              for better preparation.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}