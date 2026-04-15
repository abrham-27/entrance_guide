// src/components/Header.jsx
import React, { useState, useEffect } from "react";
import "./Header.css";
import LogoImage from "../../assets/logo.png";
// your uploaded logo

function Header() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing user from localStorage", e);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Check if we are on an admin dashboard page
  const isAdminPage = window.location.pathname.startsWith('/admin') ||
    window.location.pathname.startsWith('/usermanagement') ||
    window.location.pathname.startsWith('/VideoManagement'); // Add other admin routes if needed

  // Do not render primary header when viewing the admin dashboard layout
  if (user && user.role === 'admin' && isAdminPage) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <header className="header">

      <a href="/" className="logo">
        <img src={LogoImage} alt="Ethio Learning Logo" className="logo-img" />
        <span className="logo-text">Ethio_Learning</span>
      </a>

      <nav className="nav">
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/contact">Contact Us</a>

        <div className="dropdown">
          <button className="dropbtn">Grades</button>
          <div className="dropdown-content">
            <a href="/grade9">Grade 9</a>
            <a href="/grade10">Grade 10</a>
            <a href="/grade11">Grade 11</a>
            <a href="/grade12">Grade 12</a>
          </div>
        </div>

        <div className="dropdown">
          <button className="dropbtn">Exams</button>
          <div className="dropdown-content">
            <a href="/exams/2006">Year 2006</a>
            <a href="/exams/2007">Year 2007</a>
            <a href="/exams/2008">Year 2008</a>
            <a href="/exams/2009">Year 2009</a>
            <a href="/exams/2010">Year 2010</a>
            <a href="/exams/2011">Year 2011</a>
            <a href="/exams/2012">Year 2012</a>
            <a href="/exams/2013">Year 2013</a>
            <a href="/exams/2014">Year 2014</a>
            <a href="/exams/2015">Year 2015</a>
            <a href="/exams/2016">Year 2016</a>
            <a href="/exams/2017">Year 2017</a>
          </div>
        </div>

        <div className="dropdown">
          <button className="dropbtn">Video Guides</button>
          <div className="dropdown-content">
            <a href="/video/grade9">Grade 9</a>
            <a href="/video/grade10">Grade 10</a>
            <a href="/video/grade11">Grade 11</a>
            <a href="/video/grade12">Grade 12</a>
          </div>
        </div>
      </nav>

      {user ? (
        <div className="user-account">
          <div className="dropdown">
            <button className="dropbtn">Welcome, {user.firstName}</button>
            <div className="dropdown-content">
              <a href="/profile">Profile</a>
              <a href="#" onClick={handleLogout}>Logout</a>
            </div>
          </div>
        </div>
      ) : (
        <div className="auth">
          <a href="/login">Login</a>
          <a href="/signup" className="signup">Signup</a>
        </div>
      )}

    </header>
  );
}

export default Header;