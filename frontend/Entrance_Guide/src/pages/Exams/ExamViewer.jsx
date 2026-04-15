import React, { useState, useEffect } from "react";
import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import "./Exam.css";

const ExamViewer = () => {
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Path format: /exams/:year/:subject/:type
  const pathParts = window.location.pathname.split("/");
  const year = pathParts[2];
  const subjectSlug = pathParts[3];
  const type = pathParts[4];

  useEffect(() => {
    fetchExam();
  }, [year, subjectSlug, type]);

  const fetchExam = async () => {
    try {
      setLoading(true);
      // We need to match the subject name back from the slug if possible, 
      // but the backend filter works on raw strings. 
      // For now, let's fetch all exams for that year and filter in the frontend to be safe,
      // or improve the backend to handle slugs.
      
      const response = await fetch(`http://localhost/Entrance_Guide_api/admin_exams.php?year=${year}&type=${type}`);
      const data = await response.json();
      
      if (data.success && data.exams.length > 0) {
        // Find the one that matches our normalized subject
        const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        const matchedExam = data.exams.find(e => normalize(e.subject) === subjectSlug);
        
        if (matchedExam) {
          setExam(matchedExam);
        } else {
          setError("No resource found for this subject.");
        }
      } else {
        setError("Exam not available in the database yet.");
      }
    } catch (err) {
      setError("Failed to load exam resource.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="exam-page">
      <Header />
      <section className="exam-section viewer-section">
        <div className="viewer-header">
            <a href={`/exams/${year}`} className="back-link">← Back to {year} Exams</a>
            <h2>{year} {subjectSlug.charAt(0).toUpperCase() + subjectSlug.slice(1).replace(/-/g, ' ')} - {type.toUpperCase()}</h2>
        </div>

        <div className="viewer-content">
          {loading ? (
            <div className="loader">Searching database...</div>
          ) : error ? (
            <div className="error-box">
                <p>⚠️ {error}</p>
                <p className="small-text">Admins are regularly uploading new materials. Please check back later!</p>
            </div>
          ) : (
            <div className="exam-display">
              {exam.file_path.toLowerCase().endsWith('.pdf') ? (
                <iframe 
                  src={exam.file_url} 
                  title="Exam Viewer"
                  width="100%" 
                  height="800px"
                  style={{border: 'none', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                />
              ) : (
                <img 
                  src={exam.file_url} 
                  alt="Exam Material" 
                  style={{maxWidth: '100%', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                />
              )}
              <div className="download-area">
                  <a href={exam.file_url} download className="btn-download-pdf">
                    Download {type.toUpperCase()} File
                  </a>
              </div>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ExamViewer;
