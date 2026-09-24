import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div>
        <strong>TechSutra</strong>
        <p>E-Learning Platform for Engineers</p>
      </div>
      <p>© {new Date().getFullYear()} All rights reserved.</p>
    </footer>
  );
}
