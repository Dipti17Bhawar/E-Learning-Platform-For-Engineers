import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

import Home from "./views/Home/Home";
import Login from "./views/Login/Login";
import Register from "./views/Register/Register";
import Dashboard from "./views/Dashboard/Dashboard";
import BranchSubjects from "./views/BranchSubjects/BranchSubjects";
import Subject from "./views/Subject/Subject";
import About from "./views/About/About";
import Reviews from "./views/Reviews/Reviews";
import NotFound from "./views/NotFound/NotFound";

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

export default function App() {
  return (
    <Layout>
      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/reviews" element={<Reviews />} />

        {/* PROTECTED */}
        <Route element={<ProtectedRoute />}>

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/branch/:code"
            element={<BranchSubjects />}
          />

          {/* IMPORTANT */}
          <Route
            path="/subject/:subjectId"
            element={<Subject />}
          />

        </Route>

        {/* 404 */}
        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>
    </Layout>
  );
}