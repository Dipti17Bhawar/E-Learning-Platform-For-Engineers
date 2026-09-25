import { Routes, Route, Navigate, Outlet } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

import Home from "./views/Home/Home";
import Login from "./views/Login/Login";
import Register from "./views/Register/Register";
import Dashboard from "./views/Dashboard/Dashboard";
import BranchSubjects from "./views/BranchSubjects/BranchSubjects";
import Subject from "./views/Subject/Subject";
import Resources from "./views/Resources/Resources";
import Notes from "./views/Notes/Notes";
import QuestionPapers from "./views/QuestionPapers/QuestionPapers";
import About from "./views/About/About";
import Reviews from "./views/Reviews/Reviews";
import NotFound from "./views/NotFound/NotFound";


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

      {/* PUBLIC ROUTES */}
      <Route element={<Layout />}>

        <Route path="/" element={<Home />} />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/reviews"
          element={<Reviews />}
        />


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

          {/* SUBJECT */}
          <Route
            path="/subject/:subjectId"
            element={<Subject />}
          />

          {/* ALL RESOURCES */}
          <Route
            path="/subject/:subjectId/resources"
            element={<Resources />}
          />

          {/* NOTES */}
          <Route
            path="/subject/:subjectId/notes"
            element={<Notes />}
          />

          {/* QUESTION PAPERS */}
          <Route
            path="/subject/:subjectId/question-papers"
            element={<QuestionPapers />}
          />

          {/* STUDY MATERIALS */}
          <Route
            path="/subject/:subjectId/study-materials"
            element={<Resources />}
          />

        </Route>

        {/* 404 */}
        <Route
          path="/404"
          element={<NotFound />}
        />

        <Route
          path="*"
          element={<Navigate to="/404" replace />}
        />

      </Route>

    </Routes>
  );
}