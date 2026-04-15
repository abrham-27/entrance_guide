import React, { useEffect, useMemo, useState } from "react";
import "./GradeManagement.css";
import "./BooksManagement.css";

const API_BASE = "http://localhost/Entrance_Guide_api";
const grades = ["grade9", "grade10", "grade11", "grade12"];
const streamOptions = [
  { value: "natural", label: "Natural" },
  { value: "social", label: "Social" },
];

const courseMapping = {
  grade9: [
    "English",
    "Mathematics",
    "Biology",
    "Chemistry",
    "Physics",
    "Geography",
    "History",
    "Civics and Ethical Education",
    "ICT",
    "Physical Education",
  ],
  grade10: [
    "English",
    "Mathematics",
    "Biology",
    "Chemistry",
    "Physics",
    "Geography",
    "History",
    "Civics and Ethical Education",
    "ICT",
    "Physical Education",
  ],
  grade11: {
    natural: [
      "English",
      "Mathematics",
      "Biology",
      "Chemistry",
      "Physics",
      "ICT",
      "Physical Education",
      "Technical Drawing",
    ],
    social: [
      "English",
      "Mathematics",
      "Geography",
      "History",
      "Economics",
      "ICT",
      "Physical Education",
    ],
  },
  grade12: {
    natural: [
      "English",
      "Mathematics",
      "Biology",
      "Chemistry",
      "Physics",
      "ICT",
      "Physical Education",
      "Technical Drawing",
    ],
    social: [
      "English",
      "Mathematics",
      "Geography",
      "History",
      "Economics",
      "ICT",
      "Physical Education",
    ],
  },
};

const formatGradeLabel = (grade) => {
  const match = String(grade || "").match(/\d+/);
  return match ? `Grade ${match[0]}` : grade;
};

const BooksManagement = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  const [formData, setFormData] = useState({
    book_name: courseMapping.grade9[0],
    grade: "grade9",
    stream: "",
    description: "",
  });

  const requiresStream = useMemo(
    () => formData.grade === "grade11" || formData.grade === "grade12",
    [formData.grade],
  );

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    if (!requiresStream && formData.stream !== "") {
      setFormData((prev) => ({ ...prev, stream: "" }));
    }
  }, [requiresStream, formData.stream]);

  const currentBookOptions = () => {
    if (!formData.grade) return [];

    const isAdvanced =
      formData.grade === "grade11" || formData.grade === "grade12";

    return isAdvanced
      ? courseMapping[formData.grade][formData.stream || "natural"]
      : courseMapping[formData.grade];
  };

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/admin_books.php`);
      const data = await response.json();

      if (data.success) {
        setBooks(Array.isArray(data.books) ? data.books : []);
      } else {
        alert(data.message || "Failed to load books.");
      }
    } catch (error) {
      console.error("Failed to fetch books", error);
      alert("Failed to connect to the books service.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingBook(null);
    setCoverFile(null);
    setFormData({
      book_name: courseMapping.grade9[0],
      grade: "grade9",
      stream: "",
      description: "",
    });

    const fileInput = document.getElementById("book-cover-upload");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => {
      const next = { ...prev, [name]: value };

      if (name === "grade") {
        const isAdvanced = value === "grade11" || value === "grade12";
        const nextStream = isAdvanced ? prev.stream || "natural" : "";
        next.stream = nextStream;

        const nextOptions = isAdvanced
          ? courseMapping[value][nextStream]
          : courseMapping[value];

        next.book_name = nextOptions[0];
      }

      if (name === "stream") {
        const nextOptions = courseMapping[next.grade][value || "natural"];
        next.book_name = nextOptions[0];
      }

      return next;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.book_name.trim()) {
      alert("Please enter the book name.");
      return;
    }

    if (!formData.description.trim()) {
      alert("Please enter the book description.");
      return;
    }

    if (requiresStream && !formData.stream) {
      alert("Please select the stream.");
      return;
    }

    if (!coverFile && !editingBook) {
      alert("Please upload a cover page image.");
      return;
    }

    const payload = new FormData();

    if (editingBook) {
      payload.append("id", editingBook.id);
    }

    payload.append("book_name", formData.book_name.trim());
    payload.append("grade", formData.grade);
    payload.append("stream", requiresStream ? formData.stream : "");
    payload.append("description", formData.description.trim());

    if (coverFile) {
      payload.append("cover_page", coverFile);
    }

    try {
      setUploading(true);

      const response = await fetch(`${API_BASE}/admin_books.php`, {
        method: "POST",
        body: payload,
      });

      const result = await response.json();

      if (result.success) {
        alert(
          editingBook
            ? "Book updated successfully!"
            : "Book saved successfully!",
        );
        resetForm();
        fetchBooks();
      } else {
        alert(result.message || "Failed to save book.");
      }
    } catch (error) {
      console.error("Failed to save book", error);
      alert("Error saving the book.");
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setCoverFile(null);
    setFormData({
      book_name: book.book_name || "",
      grade: book.grade || "grade9",
      stream: book.stream || "",
      description: book.description || "",
    });

    const formElement = document.querySelector(".grade-form-container");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/admin_books.php`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (data.success) {
        setBooks((prev) => prev.filter((book) => book.id !== id));
      } else {
        alert(data.message || "Failed to delete the book.");
      }
    } catch (error) {
      console.error("Failed to delete book", error);
      alert("Error deleting the book.");
    }
  };

  return (
    <div className="grade-management-container books-management-container">
      <div className="user-management-header books-management-header">
        <h2>Books Management</h2>
        <p>
          Add and manage the books shown on the home page. These book cards
          should come from the database.
        </p>
      </div>

      <div className="grade-form-container books-form-card">
        <h3>{editingBook ? "✏️ Edit Book Card" : "📚 Add New Book Card"}</h3>

        <form onSubmit={handleSubmit}>
          <div className="form-row books-form-grid">
            <div className="form-group">
              <label>Book Name</label>
              <select
                name="book_name"
                value={formData.book_name}
                onChange={handleInputChange}
                required
              >
                {currentBookOptions().map((bookName) => (
                  <option key={bookName} value={bookName}>
                    {bookName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Grade</label>
              <select
                name="grade"
                value={formData.grade}
                onChange={handleInputChange}
                required
              >
                {grades.map((grade) => (
                  <option key={grade} value={grade}>
                    {formatGradeLabel(grade)}
                  </option>
                ))}
              </select>
            </div>

            {requiresStream && (
              <div className="form-group">
                <label>Stream</label>
                <select
                  name="stream"
                  value={formData.stream}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled>
                    Select Stream
                  </option>
                  {streamOptions.map((stream) => (
                    <option key={stream.value} value={stream.value}>
                      {stream.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="form-group">
              <label>Cover Page {editingBook ? "(Optional)" : ""}</label>
              <input
                id="book-cover-upload"
                type="file"
                accept="image/*"
                onChange={(event) =>
                  setCoverFile(event.target.files?.[0] || null)
                }
                required={!editingBook}
              />
            </div>
          </div>

          <div
            className="form-group full-width"
            style={{ marginBottom: "20px" }}
          >
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="5"
              placeholder="Write a short description for the home page card..."
              required
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                resize: "vertical",
                fontFamily: "inherit",
              }}
            />
          </div>

          <div
            className="upload-btn-container books-form-actions"
            style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
          >
            <button
              type="submit"
              className="btn-upload btn-save-book"
              disabled={uploading}
            >
              {uploading
                ? "Saving..."
                : editingBook
                  ? "Update Book"
                  : "Save Book"}
            </button>

            {editingBook && (
              <button
                type="button"
                className="btn-delete btn-cancel-book"
                onClick={resetForm}
                style={{
                  background: "#6b7280",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "4px",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="resource-list-section books-list-card">
        <div className="books-list-header">
          <h3>Existing Book Cards</h3>
          <span className="books-count-badge">{books.length} total</span>
        </div>

        <div className="resource-table-wrapper books-table-wrapper">
          <table className="resource-table books-table">
            <thead>
              <tr>
                <th>Cover</th>
                <th>Book Name</th>
                <th>Grade</th>
                <th>Stream</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    style={{ textAlign: "center", padding: "24px" }}
                  >
                    Loading books...
                  </td>
                </tr>
              ) : books.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    style={{ textAlign: "center", padding: "24px" }}
                  >
                    No books found. Add your first book card.
                  </td>
                </tr>
              ) : (
                books.map((book) => (
                  <tr key={book.id}>
                    <td>
                      {book.cover_url ? (
                        <img
                          src={book.cover_url}
                          alt={book.book_name}
                          className="book-cover-thumb"
                        />
                      ) : (
                        <span>-</span>
                      )}
                    </td>
                    <td className="book-name-cell">
                      <strong>{book.book_name}</strong>
                    </td>
                    <td>
                      <span className="book-grade-badge">
                        {formatGradeLabel(book.grade)}
                      </span>
                    </td>
                    <td>
                      {book.stream ? (
                        <span className="book-stream-badge">{book.stream}</span>
                      ) : (
                        <span className="book-stream-badge empty">-</span>
                      )}
                    </td>
                    <td className="book-description-cell">
                      {book.description}
                    </td>
                    <td>
                      <div
                        className="book-actions"
                        style={{
                          display: "flex",
                          gap: "5px",
                          flexWrap: "wrap",
                        }}
                      >
                        <button
                          className="btn-view-small btn-edit-book"
                          onClick={() => handleEdit(book)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-delete-small btn-delete-book"
                          onClick={() => handleDelete(book.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BooksManagement;
