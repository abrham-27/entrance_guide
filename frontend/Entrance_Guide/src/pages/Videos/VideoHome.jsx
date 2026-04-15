import React from "react";
import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import "../Grade/Grade.css"; // reuse grade styles for list

const grades = ["grade9", "grade10", "grade11", "grade12"];

const slugToTitle = (slug) =>
  slug.charAt(0).toUpperCase() + slug.slice(1);

const VideoHome = () => {
  let user = null;
  try {
    const stored = localStorage.getItem("user");
    user = stored ? JSON.parse(stored) : null;
  } catch (e) {
    console.error("Failed to parse user", e);
  }

  if (!user) {
    return (
      <div className="grade-page">
        <Header />
        <section className="grade-section">
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            padding: '40px',
            borderRadius: '12px',
            textAlign: 'center',
            maxWidth: '600px',
            margin: '60px auto'
          }}>
            <h2>🔒 Premium Video Library</h2>
            <p style={{marginBottom: '20px', color: '#64748b'}}>Our expert video guides are exclusively available for registered members.</p>
            <a href="/login" style={{
              display: 'inline-block',
              padding: '12px 25px',
              backgroundColor: '#2563eb',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: '600'
            }}>Login to Access</a>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="grade-page">
      <Header />
      <section className="grade-section">
        <h2>Video Guides by Grade</h2>
        <ul className="course-list">
          {grades.map((g) => (
            <li key={g}>
              <a href={`/video/${g}`}>{slugToTitle(g)}</a>
            </li>
          ))}
        </ul>
      </section>
      <Footer />
    </div>
  );
};

export default VideoHome;
