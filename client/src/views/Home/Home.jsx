import { BookOpen, FileDown, ShieldCheck, Video } from "lucide-react";
import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-page">

      {/* HERO SECTION */}
      <section className="hero">

        <div className="hero-copy">

          <div className="hub-title">
            ENGINEERING LEARNING HUB
          </div>

          <h1>
            Learn smarter. Prepare better. Build your career.
          </h1>

          <p>
            Access branch-wise notes, video lectures, question papers and
            study materials from one simple e-learning platform.
          </p>

          

        </div>

        <div className="hero-card">
          <BookOpen size={48} />

          <h2>Everything for your semester</h2>

          <p>
            Login, select your engineering branch, choose a subject and
            access your learning resources.
          </p>
        </div>

      </section>


      {/* FEATURES SECTION */}
      <section className="section">

        <div className="section-heading">

          <span className="eyebrow">
            FEATURES
          </span>

          <h2>
            One platform for your study material
          </h2>

        </div>


        <div className="feature-grid">

          <div className="feature-card">

            <ShieldCheck />

            <h3>Secure Login</h3>

            <p>
              JWT-based authentication protects student accounts.
            </p>

          </div>


          <div className="feature-card">

            <BookOpen />

            <h3>Branch & Subjects</h3>

            <p>
              Select your branch and find its subject-wise resources.
            </p>

          </div>


          <div className="feature-card">

            <Video />

            <h3>Video Learning</h3>

            <p>
              Open video lectures directly from the resource page.
            </p>

          </div>


          <div className="feature-card">

            <FileDown />

            <h3>Download Materials</h3>

            <p>
              View and download uploaded study files.
            </p>

          </div>

        </div>

      </section>

    </div>
  );
}