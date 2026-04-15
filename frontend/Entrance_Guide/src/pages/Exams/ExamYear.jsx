import React from "react";
import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import "./Exam.css";

const courses = [
  "English",
  "Mathematics",
  "Biology",
  "Chemistry",
  "Physics",
  "Geography",
  "History",
  "Civics and Ethical Education",
  "Aptitude Test",
  
];

const ExamYear = () => {
  const pathParts = window.location.pathname.split("/");
  const year = pathParts[2] || "";

  const normalize = (str) =>
    str.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return (
    <div className="exam-page">
      <Header />

      <section className="exam-section">
        <h2>{year} Exam Resources</h2>
        <ul className="exam-course-list">
          {courses.map((course) => (
            <li key={course} className="exam-course-item">
              <span className="course-name">{course}</span>
              <div className="course-links">
                <a
                  href={`/exams/${year}/${normalize(course)}/questions`}
                  className="exam-link"
                >
                  Questions
                </a>
                <a
                  href={`/exams/${year}/${normalize(course)}/answers`}
                  className="exam-link"
                >
                  Answers
                </a>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <Footer />
    </div>
  );
};

export default ExamYear;
