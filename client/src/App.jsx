
import {
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

// Public pages
import Home from "./views/Home/Home";
import Login from "./views/Login/Login";
import Register from "./views/Register/Register";
import About from "./views/About/About";
import Reviews from "./views/Reviews/Reviews";
import NotFound from "./views/NotFound/NotFound";

// Protected pages
import Bookmarks from "./views/Bookmarks/Bookmarks.jsx";
import Dashboard from "./views/Dashboard/Dashboard";
import BranchSubjects from "./views/BranchSubjects/BranchSubjects";
import Subject from "./views/Subject/Subject";
import Resources from "./views/Resources/Resources";
import Notes from "./views/Notes/Notes";
import QuestionPapers from "./views/QuestionPapers/QuestionPapers";

// Common layout
function Layout() {
  return (
    <>
      <Navbar />

      <main className="main-content">
        <Outlet />
      </main>

      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/reviews" element={<Reviews />} />

        {/* PROTECTED ROUTES */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/branch/:code"
            element={<BranchSubjects />}
          />

          <Route
            path="/subject/:subjectId"
            element={<Subject />}
          />

          <Route
            path="/subject/:subjectId/resources"
            element={<Resources />}
          />

          <Route
            path="/subject/:subjectId/notes"
            element={<Notes />}
          />

          <Route
            path="/subject/:subjectId/question-papers"
            element={<QuestionPapers />}
          />

          <Route
            path="/subject/:subjectId/study-materials"
            element={<Resources />}
          />

          <Route
            path="/bookmarks"
            element={<Bookmarks />}
          />
        </Route>

        {/* 404 PAGE */}
        <Route
          path="/404"
          element={<NotFound />}
        />

        {/* UNKNOWN ROUTES */}
        <Route
          path="*"
          element={<Navigate to="/404" replace />}
        />
      </Route>
    </Routes>
  );
}
