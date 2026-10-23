import { useEffect, useState } from "react";
import { ArrowLeft, FileText } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

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
    let active = true;

    const fetchQuestionPapers = async () => {
      try {
        setLoading(true);
        setError("");

        if (!subjectId) {
          setError("Subject ID is missing.");
          return;
        }

        const [subjectResponse, resourceResponse] =
          await Promise.all([
            api.get(`/subjects/${subjectId}`),
            api.get(`/resources/subject/${subjectId}`),
          ]);

        const subjectData =
          subjectResponse.data?.subject || subjectResponse.data;

        const responseData = resourceResponse.data;

        const allResources = Array.isArray(responseData)
          ? responseData
          : responseData?.resources || [];

        const questionPapers = allResources.filter(
          (resource) => resource.type === "question-paper"
        );

        if (active) {
          setSubject(subjectData);
          setResources(questionPapers);
        }
      } catch (err) {
        console.error("Error fetching question papers:", err);

        if (active) {
          setError(
            err.response?.data?.message ||
              "Unable to load question papers."
          );
          setResources([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchQuestionPapers();

    return () => {
      active = false;
    };
  }, [subjectId]);

  const goBack = () => {
    navigate(`/subject/${subjectId}`);
  };

  return (
    <div className="qps-page">
      <div className="qps-container">
        <button
          type="button"
          className="back-button"
          onClick={goBack}
        >
          <ArrowLeft size={18} />
          Back to Subject
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
              Practice previous year and important question papers.
            </p>
          </div>
        </div>

        {error ? (
          <div className="qps-message">
            <FileText size={45} />
            <h3>Unable to load question papers</h3>
            <p>{error}</p>
          </div>
        ) : loading ? (
          <div className="qps-message">
            <div className="loader" />
            <p>Loading question papers...</p>
          </div>
        ) : resources.length === 0 ? (
          <div className="qps-message">
            <FileText size={45} />
            <h3>No question papers available</h3>
            <p>Question papers have not been added yet.</p>
          </div>
        ) : (
          <div className="qps-grid">
            {resources.map((resource, index) => (
              <ResourceCard
                key={resource._id || resource.id || index}
                resource={resource}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}