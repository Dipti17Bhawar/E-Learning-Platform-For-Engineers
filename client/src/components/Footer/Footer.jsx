import {
  MapPin,
  Mail,
  Phone,
} from "lucide-react";

import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* BRAND */}
        <div className="footer-section footer-brand">
          <h3>TechSutra</h3>

          <p>
            E-Learning Platform for Engineers
          </p>

          <p className="footer-description">
            Learn smarter. Prepare better.
            Build your career.
          </p>
        </div>


        {/* QUICK LINKS */}
        <div className="footer-section">
          <h4>Quick Links</h4>

          <a href="/">Home</a>

          <a href="/about">About</a>

          <a href="/reviews">Reviews</a>

          <a href="/dashboard">Dashboard</a>
        </div>


        {/* LEARNING */}
        <div className="footer-section">
          <h4>Learning</h4>

          <a href="/dashboard">
            Branches
          </a>

          <a href="/dashboard">
            Subjects
          </a>

          <a href="/dashboard">
            Notes
          </a>

          <a href="/dashboard">
            Question Papers
          </a>
        </div>


        {/* CONTACT */}
        <div className="footer-section footer-contact">
          <h4>Contact Us</h4>

          <p>
            <MapPin size={17} />
            <span>
              Maharashtra, India
            </span>
          </p>

          <p>
            <Mail size={17} />
            <span>
              support@techsutra.com
            </span>
          </p>

          <p>
            <Phone size={17} />
            <span>
              +91 98765 43210
            </span>
          </p>
        </div>

      </div>


      {/* BOTTOM */}
      <div className="footer-bottom">

        <p>
          © {new Date().getFullYear()} TechSutra.
          All rights reserved.
        </p>

      </div>

    </footer>
  );
}