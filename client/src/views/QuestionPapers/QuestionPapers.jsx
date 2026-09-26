import { useEffect, useState } from "react";

import {
  ArrowLeft,
  FileText,
} from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import api from "../../api/axios";

import ResourceCard from "../../components/ResourceCard/ResourceCard";

import "./QuestionPapers.css";

export default function QuestionPapers() {
  const { subjectId } = useParams();
  const navigate = useNavigate();

  const [resources, setResources] = useState([]);
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuestionPapers = async () => {
      try {
        setLoading(true);
        setError("");

        if (!subjectId) {
          setError("Subject ID is missing.");
          return;
        }

        console.log(
          "Question Papers Subject ID:",
          subjectId
        );

        const [
          subjectResponse,
          resourceResponse,
        ] = await Promise.all([
          api.get(`/subjects/${subjectId}`),

          api.get(
            `/resources/subject/${subjectId}`
          ),
        ]);

        // --------------------------------------------
        // SUBJECT
        // --------------------------------------------
        const subjectData =
          subjectResponse.data?.subject ||
          subjectResponse.data;

        setSubject(subjectData);

        // --------------------------------------------
        // ALL RESOURCES
        // --------------------------------------------
        const allResources =
          Array.isArray(resourceResponse.data)
            ? resourceResponse.data
            : resourceResponse.data?.resources ||
              [];

        console.log(
          "All resources:",
          allResources
        );

        // --------------------------------------------
        // ONLY QUESTION PAPERS
        // --------------------------------------------
        const questionPapers =
          allResources.filter(
            (resource) =>
              resource.type === "question-paper"
          );

        console.log(
          "Question papers:",
          questionPapers
        );

        setResources(questionPapers);

      } catch (error) {
        console.error(
          "Error fetching question papers:",
          error
        );

        console.error(
          "Status:",
          error.response?.status
        );

        console.error(
          "Response:",
          error.response?.data
        );

        setError(
          error.response?.data?.message ||
            "Unable to load question papers."
        );

        setResources([]);

      } finally {
        setLoading(false);
      }
    };

    fetchQuestionPapers();
  }, [subjectId]);

  return (
    <div className="qps-page">

      <div className="qps-container">

        {/* BACK TO SUBJECT */}
        <button
          type="button"
          className="back-button"
          onClick={() =>
            navigate(`/subject/${subjectId}`)
          }
        >
          <ArrowLeft size={18} />

          Back to Subject
        </button>

        {/* HEADER */}
        <div className="qps-header">

          <div className="qps-header-icon">
            <FileText size={30} />
          </div>

          <div>

            <span>
              Practice Material
            </span>

            <h1>
              {subject?.name || "Subject"}{" "}
              Question Papers
            </h1>

            <p>
              Practice previous year and important
              question papers.
            </p>

          </div>

        </div>

        {/* ERROR */}
        {error ? (

          <div className="qps-message">

            <FileText size={45} />

            <h3>
              Unable to load question papers
            </h3>

            <p>
              {error}
            </p>

          </div>

        ) : loading ? (

          /* LOADING */
          <div className="qps-message">

            <div className="loader"></div>

            <p>
              Loading question papers...
            </p>

          </div>

        ) : resources.length === 0 ? (

          /* NO QUESTION PAPERS */
          <div className="qps-message">

            <FileText size={45} />

            <h3>
              No question papers available
            </h3>

            <p>
              Question papers have not been
              added yet.
            </p>

          </div>

        ) : (

          /* QUESTION PAPERS GRID */
          <div className="qps-grid">

            {resources.map(
              (resource, index) => (

                <ResourceCard
                  key={
                    resource._id ||
                    resource.id ||
                    index
                  }
                  resource={resource}
                />

              )
            )}

          </div>

        )}

      </div>

    </div>
  );
}