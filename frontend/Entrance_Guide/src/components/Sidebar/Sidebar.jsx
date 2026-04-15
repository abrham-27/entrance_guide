import React from "react";
import "./Sidebar.css";

function Sidebar({ active, onSelect }) {
  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <h2>Admin Panel</h2>
      </div>
      <nav>
        <ul>
          <li
            className={active === "dashboard" ? "active" : ""}
            onClick={() => onSelect("dashboard")}
          >
            Home
          </li>
          <li
            className={active === "users" ? "active" : ""}
            onClick={() => onSelect("users")}
          >
            User Management
          </li>
          <li
            className={active === "exams" ? "active" : ""}
            onClick={() => onSelect("exams")}
          >
            Exam Section
          </li>
          <li
            className={active === "grades" ? "active" : ""}
            onClick={() => onSelect("grades")}
          >
            Grade Management
          </li>
          <li
            className={active === "videos" ? "active" : ""}
            onClick={() => onSelect("videos")}
          >
            Video Guide
          </li>
          <li
            className={active === "books" ? "active" : ""}
            onClick={() => onSelect("books")}
          >
            Books Management
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
