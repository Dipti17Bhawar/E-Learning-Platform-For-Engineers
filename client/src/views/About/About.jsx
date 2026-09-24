import {
  BookOpen,
  FileText,
  Video,
  GraduationCap,
} from "lucide-react";

import "./About.css";

export default function About() {
  return (
    <div className="simple-page">

      <section className="simple-hero">
        <span className="eyebrow">ABOUT THE PLATFORM</span>

        <h1>E-Learning Platform for Engineers</h1>

        <p>
          A centralized e-learning platform designed for engineering students
          to easily access branch-wise and subject-wise study resources.
        </p>
      </section>

      <section className="about-grid">

        <div className="about-card">
          <BookOpen />
          <h3>Study Resources</h3>
          <p>
            Access organized notes, study materials and important resources
            for your engineering subjects in one place.
          </p>
        </div>

        <div className="about-card">
          <FileText />
          <h3>Question Papers</h3>
          <p>
            Find previous question papers and practice materials to understand
            exam patterns and prepare effectively.
          </p>
        </div>

        <div className="about-card">
          <Video />
          <h3>Video Lectures</h3>
          <p>
            Learn difficult concepts through subject-wise video lectures and
            improve your understanding at your own pace.
          </p>
        </div>

        <div className="about-card">
          <GraduationCap />
          <h3>Engineering Learning</h3>
          <p>
            Select your engineering branch and subjects to discover relevant
            learning content and support your academic preparation.
          </p>
        </div>

      </section>
    </div>
  );
}