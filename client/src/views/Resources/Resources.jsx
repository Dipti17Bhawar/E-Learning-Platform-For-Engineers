import { useParams } from "react-router-dom";
import "./Resources.css";

export default function Resources() {
  const { id } = useParams();

  return (
    <div className="resources-page">
      <h1>Subject Resources</h1>

      <p>Subject ID: {id}</p>

      <div className="resource-grid">

        <div className="resource-card">
          <h2>Notes</h2>
          <p>View subject notes.</p>
        </div>

        <div className="resource-card">
          <h2>Question Papers</h2>
          <p>View previous question papers.</p>
        </div>

        <div className="resource-card">
          <h2>Videos</h2>
          <p>View subject videos.</p>
        </div>

      </div>
    </div>
  );
}