import { Routes, Route } from "react-router-dom";

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
import About from "./views/About/About";
import Reviews from "./views/Reviews/Reviews";
import NotFound from "./views/NotFound/NotFound";


// ========================================
// LAYOUT
// ========================================

function Layout({ children }) {
  return (
    <>
      <Navbar />

      <main className="main-content">
        {children}
      </main>

      <Footer />
    </>
  );
}


// ========================================
// APP
// ========================================

export default function App() {
  return (
    <Layout>

      <Routes>

        {/* ==================================
            PUBLIC ROUTES
        ================================== */}

        <Route
          path="/"
          element={<Home />}
        />

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


        {/* ==================================
            PROTECTED ROUTES
        ================================== */}

        <Route element={<ProtectedRoute />}>

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          {/* Branch Subjects */}
          <Route
            path="/branch/:code"
            element={<BranchSubjects />}
          />

          {/* Subject Details */}
          <Route
            path="/subject/:subjectId"
            element={<Subject />}
          />

          {/* Subject Resources */}
          <Route
            path="/subject/:subjectId/resources"
            element={<Resources />}
          />

        </Route>


        {/* ==================================
            404 PAGE
        ================================== */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>

    </Layout>
  );
}