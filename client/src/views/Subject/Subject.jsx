import { useEffect, useState } from "react";

import {
  ArrowLeft,
  BookOpen,
  FileText,
} from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import api from "../../api/axios";

import "./Subject.css";

export default function Subject() {
  const { subjectId } = useParams();
  const navigate = useNavigate();

  const [subject, setSubject] = useState(null);
  const [resources, setResources] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSubject = async () => {
      try {
        setLoading(true);
        setError("");

        // Get subject
        const subjectResponse = await api.get(
          `/subjects/${subjectId}`
        );

        setSubject(
          subjectResponse.data.subject ||
            subjectResponse.data
        );

        // Get resources belonging to this subject
        const resourceResponse = await api.get(
          `/resources/subject/${subjectId}`
        );

        const resourceData =
          resourceResponse.data.resources ||
          resourceResponse.data ||
          [];

        setResources(
          Array.isArray(resourceData)
            ? resourceData
            : []
        );
      } catch (err) {
        console.error(
          "Subject loading error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Unable to load subject resources."
        );
      } finally {
        setLoading(false);
      }
    };

    if (subjectId) {
      loadSubject();
    }
  }, [subjectId]);

  // --------------------------------------------
  // RESOURCE COUNTS
  // --------------------------------------------

  const notesCount = resources.filter(
    (resource) =>
      resource.type === "notes"
  ).length;

  const questionPapersCount =
    resources.filter(
      (resource) =>
        resource.type === "question-paper"
    ).length;

  // --------------------------------------------
  // LOADING
  // --------------------------------------------

  if (loading) {
    return (
      <div className="subject-page">
        <div className="subject-container">
          <p>Loading subject...</p>
        </div>
      </div>
    );
  }

  // --------------------------------------------
  // ERROR
  // --------------------------------------------

  if (error) {
    return (
      <div className="subject-page">
        <div className="subject-container">

          <button
            type="button"
            className="back-button"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} />
            Back to All Subjects
          </button>

          <div className="error-message">
            {error}
          </div>

        </div>
      </div>
    );
  }

  // --------------------------------------------
  // SUBJECT NOT FOUND
  // --------------------------------------------

  if (!subject) {
    return (
      <div className="subject-page">
        <div className="subject-container">

          <button
            type="button"
            className="back-button"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} />
            Back to All Subjects
          </button>

          <p>
            Subject not found.
          </p>

        </div>
      </div>
    );
  }

  // --------------------------------------------
  // MAIN PAGE
  // --------------------------------------------

  return (
    <div className="subject-page">

      <div className="subject-container">

        {/* BACK TO ALL SUBJECTS */}
        <button
          type="button"
          className="back-button"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} />
          Back to All Subjects
        </button>


        {/* SUBJECT HEADER */}
        <div className="subject-header">

          <div className="subject-icon">
            <BookOpen size={42} />
          </div>

          <div>

            <span className="subject-label">
              SUBJECT
            </span>

            <h1>
              {subject.name}
            </h1>

            <p>
              {subject.description ||
                "Study resources for this subject."}
            </p>

          </div>

        </div>


        {/* RESOURCES HEADING */}
        <div className="resources-heading">

          <div>

            <h2>
              Learning Resources
            </h2>

            <p>
              Select a resource category to
              continue learning.
            </p>

          </div>

        </div>


        {/* RESOURCE CARDS */}
        <div className="resource-grid">

          {/* NOTES */}
          <div
            className="resource-card"
            onClick={() =>
              navigate(
                `/subject/${subjectId}/notes`
              )
            }
          >

            <div className="resource-icon notes-icon">
              <FileText size={28} />
            </div>

            <h3>
              Notes
            </h3>

            <p>
              Study notes and learning
              materials for this subject.
            </p>

            <strong>
              {notesCount}{" "}
              {notesCount === 1
                ? "resource"
                : "resources"}
            </strong>

          </div>


          {/* QUESTION PAPERS */}
          <div
            className="resource-card"
            onClick={() =>
              navigate(
                `/subject/${subjectId}/question-papers`
              )
            }
          >

            <div className="resource-icon qp-icon">
              <FileText size={28} />
            </div>

            <h3>
              Question Papers
            </h3>

            <p>
              Previous year examination
              papers for practice.
            </p>

            <strong>
              {questionPapersCount}{" "}
              {questionPapersCount === 1
                ? "paper"
                : "papers"}
            </strong>

          </div>

        </div>

      </div>

    </div>
  );
}