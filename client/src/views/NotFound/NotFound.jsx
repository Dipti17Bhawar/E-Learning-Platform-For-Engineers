import { Link } from "react-router-dom";
import "./NotFound.css";

export default function NotFound() {
  return (
    <div className="not-found">
      <h1>404</h1>
      <h2>Page not found</h2>
      <p>The page you requested does not exist.</p>
      <Link className="btn btn-primary" to="/">Go Home</Link>
    </div>
  );
}
