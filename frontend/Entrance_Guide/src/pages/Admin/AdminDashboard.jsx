import React, { useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Footer from "../../components/Footer/Footer.jsx";
import "./Admin.css";

import UserManagement from "./usermanagment";
import ExamManagement from "./ExamManagement";
import GradeManagement from "./GradeManagement";
import VideoManagement from "./VideoManagement";
import BooksManagement from "./BooksManagement";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  let user = {};
  try {
    const stored = localStorage.getItem("user");
    user = stored ? JSON.parse(stored) : {};
  } catch (e) {
    console.error("Failed to parse user", e);
  }

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <>
            <div className="welcome-section">
              <h3 className="welcome-text">
                Welcome, {user.firstName || "Admin"}
              </h3>
              <p className="welcome-animation">
                ✨ You have full control over the system. ✨
              </p>
            </div>

            <div className="admin-cards">
              <div
                className="card"
                onClick={() => setActiveSection("users")}
                style={{ cursor: "pointer" }}
              >
                <h4>Users</h4>
                <p>See and manage registered users</p>
              </div>
              <div
                className="card"
                onClick={() => setActiveSection("exams")}
                style={{ cursor: "pointer" }}
              >
                <h4>Exams</h4>
                <p>Upload or review exam materials</p>
              </div>
              <div
                className="card"
                onClick={() => setActiveSection("grades")}
                style={{ cursor: "pointer" }}
              >
                <h4>Grade Materials</h4>
                <p>Add or edit grade book listings</p>
              </div>
              <div
                className="card"
                onClick={() => setActiveSection("videos")}
                style={{ cursor: "pointer" }}
              >
                <h4>Videos</h4>
                <p>Manage video guides and tutorials</p>
              </div>
              <div
                className="card"
                onClick={() => setActiveSection("books")}
                style={{ cursor: "pointer" }}
              >
                <h4>Books</h4>
                <p>Upload and manage homepage book cards</p>
              </div>
            </div>
          </>
        );
      case "users":
        return <UserManagement />;
      case "exams":
        return <ExamManagement />;
      case "grades":
        return <GradeManagement />;
      case "videos":
        return <VideoManagement />;
      case "books":
        return <BooksManagement />;
      default:
        return <h3>Dashboard</h3>;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div className="admin-page">
      {/* no shared header for admins */}
      <div className="admin-container">
        <Sidebar active={activeSection} onSelect={setActiveSection} />
        <div className="admin-main">
          <header className="admin-topbar">
            <div className="topbar-account">
              <span>
                {user.firstName} {user.lastName}
              </span>
              <a href="/account">Account</a>
              <button onClick={handleLogout}>Logout</button>
            </div>
          </header>
          <main className="main-content">{renderContent()}</main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
