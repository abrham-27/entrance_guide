import React, { useEffect, useMemo, useState } from "react";
import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import HeroImage from "../../assets/hero.jpg";
import GuideBook from "../../assets/guidebook.jpg";
import Exams from "../../assets/exams.jpg";
import Video from "../../assets/video.png";
import "./Home.css";

const API_BASE = "http://localhost/Entrance_Guide_api";

const xmlSafe = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const slugify = (value) =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const formatGradeLabel = (grade) => {
  const match = String(grade || "").match(/\d+/);
  return match ? `Grade ${match[0]}` : grade;
};

const formatStreamLabel = (stream) => {
  if (!stream) return "General";
  return stream === "natural"
    ? "Natural Sciences"
    : stream === "social"
      ? "Social Sciences"
      : stream;
};

const subjectPalette = {
  mathematics: {
    accent: "#2563eb",
    secondary: "#0f172a",
    glow: "#60a5fa",
  },
  english: {
    accent: "#8b5cf6",
    secondary: "#312e81",
    glow: "#c4b5fd",
  },
  biology: {
    accent: "#10b981",
    secondary: "#064e3b",
    glow: "#6ee7b7",
  },
  chemistry: {
    accent: "#f97316",
    secondary: "#7c2d12",
    glow: "#fdba74",
  },
  physics: {
    accent: "#06b6d4",
    secondary: "#164e63",
    glow: "#67e8f9",
  },
  history: {
    accent: "#f59e0b",
    secondary: "#78350f",
    glow: "#fcd34d",
  },
  civics: {
    accent: "#ec4899",
    secondary: "#831843",
    glow: "#f9a8d4",
  },
  economics: {
    accent: "#14b8a6",
    secondary: "#134e4a",
    glow: "#5eead4",
  },
  geography: {
    accent: "#84cc16",
    secondary: "#365314",
    glow: "#bef264",
  },
  default: {
    accent: "#2563eb",
    secondary: "#0f172a",
    glow: "#38bdf8",
  },
};

const createBookCover = ({
  title,
  grade,
  accent = "#2563eb",
  secondary = "#0f172a",
  glow = "#38bdf8",
  tag = "Student Book",
}) => {
  const safeTitle = xmlSafe(title);
  const safeGrade = xmlSafe(grade);
  const safeTag = xmlSafe(tag);

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="820" viewBox="0 0 600 820">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${secondary}" />
          <stop offset="100%" stop-color="${accent}" />
        </linearGradient>
        <linearGradient id="glowLine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="${glow}" stop-opacity="0" />
          <stop offset="50%" stop-color="${glow}" stop-opacity="1" />
          <stop offset="100%" stop-color="${glow}" stop-opacity="0" />
        </linearGradient>
      </defs>

      <rect width="600" height="820" rx="36" fill="url(#bg)" />
      <rect x="28" y="28" width="544" height="764" rx="30" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.16)" />
      <circle cx="500" cy="120" r="110" fill="rgba(255,255,255,0.12)" />
      <circle cx="92" cy="690" r="130" fill="rgba(56,189,248,0.12)" />
      <path d="M60 220 C180 150, 340 150, 540 260" stroke="url(#glowLine)" stroke-width="8" fill="none" stroke-linecap="round"/>
      <path d="M60 570 C180 500, 340 500, 540 610" stroke="url(#glowLine)" stroke-width="8" fill="none" stroke-linecap="round"/>

      <rect x="64" y="76" width="172" height="46" rx="23" fill="rgba(255,255,255,0.18)" />
      <text x="150" y="106" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" font-weight="700" fill="#ffffff">${safeGrade}</text>

      <text x="64" y="360" font-family="Arial, sans-serif" font-size="30" font-weight="600" fill="rgba(255,255,255,0.80)">Ethio Learning</text>
      <text x="64" y="430" font-family="Arial, sans-serif" font-size="58" font-weight="800" fill="#ffffff">${safeTitle}</text>
      <text x="64" y="490" font-family="Arial, sans-serif" font-size="28" font-weight="500" fill="rgba(255,255,255,0.85)">${safeTag}</text>

      <rect x="64" y="618" width="472" height="2" fill="rgba(255,255,255,0.24)" />
      <text x="64" y="675" font-family="Arial, sans-serif" font-size="22" font-weight="600" fill="rgba(255,255,255,0.82)">Curriculum-aligned learning resource</text>
      <text x="64" y="717" font-family="Arial, sans-serif" font-size="18" font-weight="500" fill="rgba(255,255,255,0.65)">Prepared for Ethiopian students</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const getCoverForBook = (book) => {
  if (book.cover_url) {
    return book.cover_url;
  }

  const palette =
    subjectPalette[slugify(book.subject || book.book_name)] ||
    subjectPalette.default;

  return createBookCover({
    title: book.subject || book.book_name,
    grade: book.grade,
    accent: palette.accent,
    secondary: palette.secondary,
    glow: palette.glow,
  });
};

const buildCourseRoute = (book) => {
  const gradeSlug = String(book.grade_slug || book.grade || "").toLowerCase();
  const subjectSlug = slugify(book.subject || book.book_name);
  const streamSlug = String(
    book.stream_slug || book.stream || "",
  ).toLowerCase();

  if ((gradeSlug === "grade11" || gradeSlug === "grade12") && streamSlug) {
    return `/courses/${gradeSlug}/${streamSlug}/${subjectSlug}`;
  }

  return `/courses/${gradeSlug}/${subjectSlug}`;
};

const mapApiBookToCard = (book) => {
  const gradeSlug = String(book.grade || "").toLowerCase();
  const streamSlug = String(book.stream || "").toLowerCase();

  const mapped = {
    id: book.id,
    subject: book.book_name,
    grade: formatGradeLabel(gradeSlug),
    grade_slug: gradeSlug,
    stream: formatStreamLabel(streamSlug),
    stream_slug: streamSlug,
    description: book.description,
    cover_url: book.cover_url || null,
  };

  return {
    ...mapped,
    route: buildCourseRoute(mapped),
    cover: getCoverForBook(mapped),
  };
};

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [booksError, setBooksError] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoadingBooks(true);
        setBooksError("");

        const response = await fetch(`${API_BASE}/admin_books.php`);
        const data = await response.json();

        if (data.success && Array.isArray(data.books)) {
          setBooks(data.books.map(mapApiBookToCard));
        } else {
          setBooks([]);
          setBooksError(data.message || "Failed to load books.");
        }
      } catch (error) {
        console.error("Failed to fetch homepage books", error);
        setBooks([]);
        setBooksError("Failed to connect to the books service.");
      } finally {
        setLoadingBooks(false);
      }
    };

    fetchBooks();
  }, []);

  const filteredBooks = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return books;
    }

    return books.filter((book) =>
      [book.grade, book.stream, book.subject, book.description]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [books, searchQuery]);

  const groupedBooks = useMemo(() => {
    return filteredBooks.reduce((acc, book) => {
      const key = `${book.grade}__${book.stream}`;

      if (!acc[key]) {
        acc[key] = {
          grade: book.grade,
          stream: book.stream,
          books: [],
        };
      }

      acc[key].books.push(book);
      return acc;
    }, {});
  }, [filteredBooks]);

  const groupEntries = Object.values(groupedBooks);

  return (
    <div className="home-page">
      <Header />

      <section
        className="hero-section hero-fixed"
        style={{ backgroundImage: `url(${HeroImage})` }}
      >
        <div className="hero-overlay" />

        <div className="hero-text">
          <span className="hero-badge">Grade 12 Guide System</span>
          <h1>Learn smarter with books, exams, and guided preparation.</h1>
          <p>
            Explore curriculum-based resources in a modern learning space built
            for Ethiopian students.
          </p>
          <div className="hero-actions">
            <a href="#explore-books" className="hero-btn">
              Explore Books
            </a>
            <a href="/entrance-exams" className="hero-btn hero-btn-secondary">
              View Exams
            </a>
          </div>
        </div>
      </section>

      <main className="home-content-shell">
        <section className="second-section full-browser-section about-hero-section">
          <div className="container about-grid">
            <div className="about-copy">
              <span className="section-eyebrow">About Our Guide</span>
              <h2>Your complete preparation companion</h2>
              <p>
                We bring together entrance exams, study materials, and academic
                guidance in one place so you can prepare with confidence and
                consistency.
              </p>
            </div>

            <div className="about-highlights">
              <div className="highlight-card">
                <strong>{books.length}+</strong>
                <span>Book pathways</span>
              </div>
              <div className="highlight-card">
                <strong>4</strong>
                <span>Grade levels</span>
              </div>
              <div className="highlight-card">
                <strong>2</strong>
                <span>Preparatory streams</span>
              </div>
            </div>
          </div>
        </section>

        <section className="resources-section modern-panel">
          <div className="container">
            <span className="section-eyebrow">Learning Resources</span>
            <h2 className="section-title">Everything you need in one place</h2>

            <div className="resource-cards">
              <a href="/guide-books" className="resource-card">
                <img src={GuideBook} alt="Guide Books" />
                <h3>Guide Books</h3>
                <p>
                  Access recommended guide books for Ethiopian entrance exam
                  preparation.
                </p>
              </a>

              <a href="/entrance-exams" className="resource-card">
                <img src={Exams} alt="Entrance Exams" />
                <h3>Entrance Exams</h3>
                <p>
                  Practice with past Ethiopian university entrance exam papers.
                </p>
              </a>

              <a href="/video" className="resource-card">
                <img src={Video} alt="Video Guides" />
                <h3>Video Guides</h3>
                <p>
                  Watch educational videos and tutorials for better
                  understanding.
                </p>
              </a>
            </div>
          </div>
        </section>

        <section
          className="grade-books-section full-browser-section books-hero-section"
          id="explore-books"
        >
          <div className="container">
            <div className="explore-books-header">
              <div>
                <span className="section-eyebrow">Book Library</span>
                <h2>Explore Books</h2>
                <p>
                  Search by grade, stream, or subject and jump directly into the
                  book collection you need.
                </p>
              </div>

              <div className="books-search-box">
                <label htmlFor="book-search" className="search-label">
                  Search books
                </label>
                <div className="search-input-wrap">
                  <span className="search-icon">⌕</span>
                  <input
                    id="book-search"
                    type="text"
                    placeholder="Search Mathematics, Grade 12, Biology, Social Sciences..."
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="explore-books-meta">
              <span>
                {loadingBooks
                  ? "Loading books..."
                  : `${filteredBooks.length} books found`}
              </span>
              {searchQuery.trim() ? (
                <button
                  type="button"
                  className="clear-search-btn"
                  onClick={() => setSearchQuery("")}
                >
                  Clear search
                </button>
              ) : (
                <span>Browse the full collection</span>
              )}
            </div>

            {loadingBooks ? (
              <div className="no-books-state">
                <h3>Loading books...</h3>
                <p>
                  Please wait while we fetch the latest books from the database.
                </p>
              </div>
            ) : booksError ? (
              <div className="no-books-state">
                <h3>Books are unavailable right now</h3>
                <p>{booksError}</p>
              </div>
            ) : groupEntries.length > 0 ? (
              groupEntries.map((group) => (
                <div
                  className="grade-section modern-grade-section"
                  key={`${group.grade}-${group.stream}`}
                >
                  <div className="grade-section-heading">
                    <div>
                      <h3>{group.grade}</h3>
                      {group.stream !== "General" && (
                        <p className="stream-pill">{group.stream}</p>
                      )}
                    </div>
                  </div>

                  <div className="book-cards">
                    {group.books.map((book) => (
                      <a
                        href={book.route}
                        className="book-card modern-book-card"
                        key={book.id || book.route}
                      >
                        <div className="book-cover-wrap">
                          <img
                            src={book.cover}
                            alt={`${book.subject} book cover`}
                          />
                        </div>
                        <div className="book-card-content">
                          <div className="book-card-topline">
                            <span>{book.grade}</span>
                            <span>{book.stream}</span>
                          </div>
                          <h4>{book.subject}</h4>
                          <p>{book.description}</p>
                          <span className="book-link-text">
                            Open book collection →
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-books-state">
                <h3>No matching books found</h3>
                <p>
                  {books.length === 0
                    ? "No books have been added yet. Use the admin Books Management section to upload books."
                    : "Try another keyword like Mathematics, Grade 10, or Biology."}
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
