import React from "react";
import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import "./Grade.css";

const Grade9 = () => {
  const courses = [
    "English",
    "Mathematics",
    "Biology",
    "Chemistry",
    "Physics",
    "Geography",
    "History",
    "Civics and Ethical Education",
    "ICT (Information Communication Technology)",
    "Physical Education (PE)",
    "Local Language (Amharic / Afaan Oromo / Tigrigna depending on region)",
  ];

  // determine if user is viewing video section
  const isVideo = window.location.pathname.startsWith("/video");
  const base = isVideo ? "/video" : "/courses";

  return (
    <div className="grade-page">
      <Header />

      <section className="grade-section">
        <h2>Grade 9 Courses</h2>
        <ul className="course-list">
          {courses.map((course) => (
            <li key={course}>
              <a
                href={`${base}/grade9/${course
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")}`}
              >
                {course}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <Footer />
    </div>
  );
};

export default Grade9;
