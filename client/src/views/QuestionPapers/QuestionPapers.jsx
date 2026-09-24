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

  useEffect(() => {
    const fetchQuestionPapers = async () => {
      try {
        const [subjectResponse, resourceResponse] =
          await Promise.all([
            api.get(`/subjects/${subjectId}`),

            api.get(
              `/resources/subject/${subjectId}?type=qp`
            ),
          ]);

        setSubject(
          subjectResponse.data.subject ||
            subjectResponse.data
        );

        setResources(
          Array.isArray(resourceResponse.data)
            ? resourceResponse.data
            : resourceResponse.data.resources || []
        );
      } catch (error) {
        console.error(
          "Error fetching question papers:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionPapers();
  }, [subjectId]);

  return (
    <div className="qps-page">

      <div className="qps-container">

        <button
          className="back-button"
          onClick={() =>
            navigate(
              `/subjects/${subjectId}/resources`
            )
          }
        >
          <ArrowLeft size={18} />
          Back to Resources
        </button>

        <div className="qps-header">

          <div className="qps-header-icon">
            <FileText size={30} />
          </div>

          <div>
            <span>Practice Material</span>

            <h1>
              {subject?.name || "Subject"} Question Papers
            </h1>

            <p>
              Practice previous year and important
              question papers.
            </p>
          </div>

        </div>

        {loading ? (
          <div className="qps-message">
            <div className="loader"></div>
            <p>Loading question papers...</p>
          </div>
        ) : resources.length === 0 ? (
          <div className="qps-message">
            <FileText size={45} />

            <h3>No question papers available</h3>

            <p>
              Question papers have not been added yet.
            </p>
          </div>
        ) : (
          <div className="qps-grid">

            {resources.map((resource) => (
              <ResourceCard
                key={resource._id}
                resource={resource}
              />
            ))}

          </div>
        )}

      </div>

    </div>
  );
}