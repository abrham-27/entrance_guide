import React from "react";
import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import "./Grade.css";

const Grade11 = () => {
  const naturalCourses = [
    "English",
    "Mathematics",
    "Biology",
    "Chemistry",
    "Physics",
    "ICT",
    "Physical Education",
    "Technical Drawing / Engineering Graphics (in some schools)",
  ];

  const socialCourses = [
    "English",
    "Mathematics",
    "Geography",
    "History",
    "Economics",
    "ICT",
    "Physical Education",
  ];

  const isVideo = window.location.pathname.startsWith("/video");
  const basePath = isVideo ? "/video" : "/courses";

  const renderList = (courses, stream) =>
    courses.map((course) => (
      <li key={course}>
        <a
          href={`${basePath}/grade11/${stream}/${course
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")}`}
        >
          {course}
        </a>
      </li>
    ));

  return (
    <div className="grade-page">
      <Header />

      <section className="grade-section">
        <h2>Grade 11 Courses</h2>
        <div className="split-section">
          <div>
            <h3>Natural Science</h3>
            <ul className="course-list">{renderList(naturalCourses, "natural")}</ul>
          </div>
          <div>
            <h3>Social Science</h3>
            <ul className="course-list">{renderList(socialCourses, "social")}</ul>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Grade11;
