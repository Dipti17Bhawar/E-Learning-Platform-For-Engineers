import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="empty-state">
      <h1>404</h1>
      <p>The page you are looking for does not exist.</p>
      <Link className="button primary" to="/">
        Go Home
      </Link>
    </div>
  );
}
