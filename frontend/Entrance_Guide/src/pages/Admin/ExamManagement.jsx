import React, { useState, useEffect } from "react";
import "./ExamManagement.css";

const years = ["2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017"];

const subjects = [
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

const ExamManagement = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    year: "2017",
    subject: "English",
    type: "questions",
  });
  const [file, setFile] = useState(null);
  const [editingExam, setEditingExam] = useState(null);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost/Entrance_Guide_api/admin_exams.php");
      const data = await response.json();
      if (data.success) {
        setExams(data.exams);
      }
    } catch (err) {
      console.error("Failed to fetch exams", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file && !editingExam) {
      alert("Please select a file to upload");
      return;
    }

    const data = new FormData();
    if (editingExam) {
      data.append("id", editingExam.id);
    }
    data.append("year", formData.year);
    data.append("subject", formData.subject);
    data.append("type", formData.type);
    if (file) {
      data.append("file", file);
    }

    try {
      setUploading(true);
      const response = await fetch("http://localhost/Entrance_Guide_api/admin_exams.php", {
        method: "POST",
        body: data,
      });
      const result = await response.json();
      if (result.success) {
        alert(editingExam ? "Exam updated successfully!" : "Exam uploaded successfully!");
        setFile(null);
        setEditingExam(null);
        setFormData({
          year: "2017",
          subject: "English",
          type: "questions",
        });
        e.target.reset();
        fetchExams();
      } else {
        alert(result.message);
      }
    } catch (err) {
      alert("Error saving exam");
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (exam) => {
    setEditingExam(exam);
    setFormData({
      year: exam.year,
      subject: exam.subject,
      type: exam.type,
    });
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingExam(null);
    setFormData({
      year: "2017",
      subject: "English",
      type: "questions",
    });
    setFile(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this exam?")) {
      try {
        const response = await fetch("http://localhost/Entrance_Guide_api/admin_exams.php", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        const data = await response.json();
        if (data.success) {
          setExams(exams.filter((exam) => exam.id !== id));
        }
      } catch (err) {
        alert("Error deleting exam");
      }
    }
  };

  return (
    <div className="exam-management-container">
      <div className="user-management-header">
        <h2>Exam Management</h2>
      </div>

      <div className="exam-upload-card">
        <h3>{editingExam ? "✏️ Edit Exam" : "📤 Upload New Exam"}</h3>
        <form onSubmit={handleSubmit}>
          <div className="exam-form-grid">
            <div className="form-group">
              <label>Exam Year</label>
              <select name="year" value={formData.year} onChange={handleInputChange}>
                {years.map((y) => (
                  <option key={y} value={y}>
                    Year {y}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Subject</label>
              <select name="subject" value={formData.subject} onChange={handleInputChange}>
                {subjects.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Exam Type</label>
              <select name="type" value={formData.type} onChange={handleInputChange}>
                <option value="questions">Questions</option>
                <option value="answers">Answers</option>
              </select>
            </div>

            <div className="form-group">
              <label>Select File {editingExam ? "(Optional)" : "(PDF/Image)"}</label>
              <input type="file" onChange={handleFileChange} required={!editingExam} />
            </div>

            <div className="upload-btn-container" style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn-upload" disabled={uploading}>
                {uploading ? "Saving..." : editingExam ? "Update Exam" : "Upload Exam"}
              </button>
              {editingExam && (
                <button type="button" className="btn-delete" onClick={cancelEdit} style={{ background: '#6b7280' }}>
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      <div className="exams-list-header">
        <h3>📑 Recently Uploaded Exams</h3>
      </div>

      <div className="exams-table-wrapper">
        <table className="exams-table">
          <thead>
            <tr>
              <th>Year</th>
              <th>Subject</th>
              <th>Type</th>
              <th>File Name</th>
              <th>Uploaded Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ textAlign: 'center' }}>Loading exams...</td></tr>
            ) : exams.length === 0 ? (
              <tr><td colSpan="6" className="empty-state">No exams found. Start uploading!</td></tr>
            ) : (
              exams.map((exam) => (
                <tr key={exam.id}>
                  <td><strong>{exam.year}</strong></td>
                  <td>{exam.subject}</td>
                  <td>
                    <span className={`badge badge-${exam.type}`}>
                      {exam.type}
                    </span>
                  </td>
                  <td>
                    <a href={exam.file_url} target="_blank" rel="noreferrer" style={{ color: '#2563eb', textDecoration: 'none' }}>
                      View File
                    </a>
                  </td>
                  <td>{new Date(exam.created_at).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button className="btn-view-small" onClick={() => handleEdit(exam)}>
                        Edit
                      </button>
                      <button className="btn-delete-small" onClick={() => handleDelete(exam.id)}>
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
  );
};

export default ExamManagement;
