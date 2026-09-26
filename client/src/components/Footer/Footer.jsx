import {
  MapPin,
  Mail,
  Phone,
} from "lucide-react";

import { Link } from "react-router-dom";

import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* ========================================= */}
        {/* BRAND */}
        {/* ========================================= */}

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


        {/* ========================================= */}
        {/* QUICK LINKS */}
        {/* ========================================= */}

        <div className="footer-section">

          <h4>Quick Links</h4>

          <Link to="/">
            Home
          </Link>

          <Link to="/about">
            About
          </Link>

          <Link to="/reviews">
            Reviews
          </Link>

          <Link to="/dashboard">
            Dashboard
          </Link>

        </div>


        {/* ========================================= */}
        {/* LEARNING */}
        {/* ========================================= */}

        <div className="footer-section">

          <h4>Learning</h4>

          <Link to="/dashboard">
            Branches
          </Link>

          <Link to="/dashboard">
            Subjects
          </Link>

          <Link to="/dashboard">
            Notes
          </Link>

          <Link to="/dashboard">
            Question Papers
          </Link>

        </div>


        {/* ========================================= */}
        {/* CONTACT */}
        {/* ========================================= */}

        <div className="footer-section footer-contact">

          <h4>Contact Us</h4>


          {/* LOCATION */}

          <a
            href="https://www.google.com/maps/search/?api=1&query=Maharashtra%2C%20India"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-contact-link"
          >

            <MapPin size={17} />

            <span>
              Maharashtra, India
            </span>

          </a>


          {/* EMAIL */}

          <a
            href="mailto:support@techsutra.com"
            className="footer-contact-link"
          >

            <Mail size={17} />

            <span>
              support@techsutra.com
            </span>

          </a>


          {/* PHONE */}

          <a
            href="tel:+919876543210"
            className="footer-contact-link"
          >

            <Phone size={17} />

            <span>
              +91 1122334455
            </span>

          </a>

          <small className="footer-demo-text">
            
          </small>

        </div>

      </div>


      {/* ========================================= */}
      {/* BOTTOM */}
      {/* ========================================= */}

      <div className="footer-bottom">

        <p>
          © {new Date().getFullYear()} TechSutra.
          All rights reserved.
        </p>

      </div>

    </footer>
  );
}