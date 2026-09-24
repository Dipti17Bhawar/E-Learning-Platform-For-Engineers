import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();

  const { user, updateBranch } = useAuth();

  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH BRANCHES
  // GET /api/branches
  // ==========================================
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/branches");

        console.log("Branches response:", response.data);

        // Backend response:
        // {
        //   success: true,
        //   branches: [...]
        // }

        if (Array.isArray(response.data)) {
          setBranches(response.data);
        } else {
          setBranches(response.data.branches || []);
        }

      } catch (err) {
        console.error("Error fetching branches:", err);

        setError(
          err.response?.data?.message ||
          "API route not found."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, []);

  // ==========================================
  // VIEW SUBJECTS
  // ==========================================
  const handleViewSubjects = (branch) => {
    if (!branch?.code) {
      console.error("Branch code is missing:", branch);
      return;
    }

    // Save selected branch in AuthContext
    updateBranch(branch.code);

    // React route
    // Example: /branch/CE
    navigate(`/branch/${branch.code}`);
  };

  return (
    <div className="dashboard-page">

      {/* ======================================
          HERO SECTION
      ====================================== */}
      <section className="dashboard-hero">

        <div className="dashboard-hero-content">

          <div>
            <h1>
              Welcome, {user?.name || "Student"}
            </h1>

            <p>
              Select your engineering branch to continue.
            </p>
          </div>

          <div className="dashboard-icon">
            <GraduationCap size={48} />
          </div>

        </div>

      </section>


      {/* ======================================
          BRANCH SECTION
      ====================================== */}
      <section className="branches-section">

        <div className="section-heading">

          <div>
            <h2>Choose Branch</h2>

            <p>
              Select a branch to see subjects and resources.
            </p>
          </div>

          <BookOpen size={34} />

        </div>


        {/* ====================================
            ERROR
        ==================================== */}
        {error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}


        {/* ====================================
            LOADING
        ==================================== */}
        {loading && (
          <div className="dashboard-message">
            <div className="dashboard-loader"></div>

            <p>
              Loading branches...
            </p>
          </div>
        )}


        {/* ====================================
            NO BRANCHES
        ==================================== */}
        {!loading &&
          !error &&
          branches.length === 0 && (
            <div className="dashboard-message">

              <BookOpen size={42} />

              <h3>
                No branches available
              </h3>

              <p>
                Branches will appear here once they
                are added by the administrator.
              </p>

            </div>
          )}


        {/* ====================================
            BRANCH CARDS
        ==================================== */}
        {!loading &&
          branches.length > 0 && (

            <div className="branches-grid">

              {branches.map((branch) => (

                <div
                  className="branch-card"
                  key={branch._id}
                >

                  {/* Branch icon/code */}
                  <div className="branch-code">
                    {branch.code}
                  </div>


                  {/* Branch information */}
                  <div className="branch-card-content">

                    <h3>
                      {branch.name}
                    </h3>

                    <p>
                      {branch.description ||
                        `${branch.name} branch`}
                    </p>

                  </div>


                  {/* View Subjects */}
                  <button
                    type="button"
                    className="view-subjects-button"
                    onClick={() =>
                      handleViewSubjects(branch)
                    }
                  >
                    View Subjects

                    <ArrowRight size={18} />
                  </button>

                </div>

              ))}

            </div>
          )}

      </section>

    </div>
  );
}