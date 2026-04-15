import React, { useState, useEffect } from "react";
import Home from "./pages/Homepage/Home";
import Grade9 from "./pages/Grade/Grade9";
import Grade10 from "./pages/Grade/Grade10";
import Grade11 from "./pages/Grade/Grade11";
import Grade12 from "./pages/Grade/Grade12";
import ExamYear from "./pages/Exams/ExamYear";
import CoursePage from "./pages/Courses/CoursePage";
import VideoHome from "./pages/Videos/VideoHome";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import Account from "./pages/Admin/Account";
import Profile from "./pages/Auth/Profile";
import StudentDashboard from "./pages/dashboard/Studentdashboard/StudentDashboard";

import ExamViewer from "./pages/Exams/ExamViewer";

import BookViewer from "./pages/Courses/BookViewer";
import VideoViewer from "./pages/Videos/VideoViewer";

function App() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  let content;
  if (path === "/" || path === "/home") {
    content = <Home />;
  } else if (path === "/video" || path === "/video/") {
    content = <VideoHome />;
  } else if (path === "/login") {
    content = <Login />;
  } else if (path === "/signup") {
    content = <Signup />;
  } else if (path === "/admin") {
    content = <AdminDashboard />;
  } else if (path === "/account") {
    content = <Account />;
  } else if (path === "/profile") {
    content = <Profile />;
  } else if (path === "/dashboard") {
    content = <StudentDashboard />;
  } else if (path === "/grade9") {
    content = <Grade9 />;
  } else if (path === "/grade10") {
    content = <Grade10 />;
  } else if (path === "/grade11") {
    content = <Grade11 />;
  } else if (path === "/grade12") {
    content = <Grade12 />;
  } else if (path === "/video/grade9") {
    content = <Grade9 />;
  } else if (path === "/video/grade10") {
    content = <Grade10 />;
  } else if (path === "/video/grade11") {
    content = <Grade11 />;
  } else if (path === "/video/grade12") {
    content = <Grade12 />;
  } else if (path.split('/').length > 3 && path.startsWith("/video/")) {
    content = <VideoViewer />;
  } else if (path.split('/').length > 3 && path.startsWith("/exams/")) {
    content = <ExamViewer />;
  } else if (path.startsWith("/exams/")) {
    content = <ExamYear />;
  } else if (path.startsWith("/books/")) {
    content = <BookViewer />;
  } else if (path.startsWith("/courses/") || path.startsWith("/video/")) {
    content = <CoursePage />;
  } else {
    content = <Home />;
  }

  return <div>{content}</div>;
}

export default App;