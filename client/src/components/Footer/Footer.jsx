
import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div>
        <strong>TechSutra</strong>
        <p>E-Learning Platform for Engineers</p>
      </div>

      <div
        style={{
          marginTop: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "28px",
        }}
      >
        <span
          style={{
            fontSize: "16px",
            fontWeight: "700",
            color: "#ffffff",
          }}
        >
          Quick Links
        </span>

        <Link
          to="/about"
          style={{
            color: "#aeb8ca",
            textDecoration: "none",
            fontSize: "16px",
            fontWeight: "500",
            transition: "0.3s",
          }}
          onMouseEnter={(e) => {
            e.target.style.color = "#ffffff";
          }}
          onMouseLeave={(e) => {
            e.target.style.color = "#aeb8ca";
          }}
        >
          About
        </Link>

        <Link
          to="/reviews"
          style={{
            color: "#aeb8ca",
            textDecoration: "none",
            fontSize: "16px",
            fontWeight: "500",
            transition: "0.3s",
          }}
          onMouseEnter={(e) => {
            e.target.style.color = "#ffffff";
          }}
          onMouseLeave={(e) => {
            e.target.style.color = "#aeb8ca";
          }}
        >
          Reviews
        </Link>
      </div>

      <p>© {new Date().getFullYear()} All rights reserved.</p>
    </footer>
  );
}
