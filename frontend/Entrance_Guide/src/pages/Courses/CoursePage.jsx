import React from "react";
import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import "./Course.css";

const books = [
  "Galaxy",
  "Top",
  "Extreme",
  "Textbook",
  "Customary",
  "Mastery",
];

// convert slug back to title-cased string
const slugToTitle = (slug) =>
  slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

const CoursePage = () => {
  const parts = window.location.pathname.split("/");
  // Format could be /courses/grade9/maths OR /courses/grade11/natural/maths
  
  let grade, stream = null, courseSlug;
  
  if (parts.length > 4) {
    grade = parts[2];
    stream = parts[3];
    courseSlug = parts[4];
  } else {
    grade = parts[2];
    courseSlug = parts[3];
  }
  
  const courseTitle = slugToTitle(courseSlug);
  const displayGrade = slugToTitle(grade);
  const displayStream = stream ? ` (${slugToTitle(stream)})` : "";

  return (
    <div className="course-page">
      <Header />

      <section className="book-section">
        <h2>{`${displayGrade}${displayStream} - ${courseTitle} Books`}</h2>
        <div className="book-cards">
          {books.map((book) => {
            const bookSlug = book.toLowerCase().replace(/[^a-z0-9]+/g, "-");
            const bookPath = stream 
              ? `/books/${grade}/${stream}/${courseSlug}/${bookSlug}`
              : `/books/${grade}/${courseSlug}/${bookSlug}`;
            return (
              <a
                key={book}
                href={bookPath}
                className="book-card"
              >
                {/* placeholder image or colored block */}
                <div className="cover" />
                <h3>{book}</h3>
              </a>
            );
          })}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CoursePage;
