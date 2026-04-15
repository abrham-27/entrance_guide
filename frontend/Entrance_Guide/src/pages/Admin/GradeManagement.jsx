import React, { useState, useEffect } from "react";
import "./GradeManagement.css";

const grades = ["grade9", "grade10", "grade11", "grade12"];

const bookTypes = ["Galaxy", "Top", "Extreme", "Textbook", "Customary", "Mastery"];

const courseMapping = {
  grade9: [
    "English", "Mathematics", "Biology", "Chemistry", "Physics",
    "Geography", "History", "Civics and Ethical Education", "ICT", "Physical Education"
  ],
  grade10: [
    "English", "Mathematics", "Biology", "Chemistry", "Physics",
    "Geography", "History", "Civics and Ethical Education", "ICT", "Physical Education"
  ],
  grade11: {
    natural: ["English", "Mathematics", "Biology", "Chemistry", "Physics", "ICT", "Physical Education", "Technical Drawing"],
    social: ["English", "Mathematics", "Geography", "History", "Economics", "ICT", "Physical Education"]
  },
  grade12: {
    natural: ["English", "Mathematics", "Biology", "Chemistry", "Physics", "ICT", "Physical Education", "Technical Drawing"],
    social: ["English", "Mathematics", "Geography", "History", "Economics", "ICT", "Physical Education"]
  }
};

const GradeManagement = () => {
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    grade: "",
    book_type: "Galaxy",
    subject: "",
    stream: "",
  });
  const [file, setFile] = useState(null);
  const [editingResource, setEditingResource] = useState(null);

  useEffect(() => {
    if (selectedGrade) {
      fetchResources(selectedGrade);
      const isAdvanced = selectedGrade === "grade11" || selectedGrade === "grade12";
      const initialStream = isAdvanced ? "natural" : "";
      const availableSubjects = isAdvanced
        ? courseMapping[selectedGrade][initialStream]
        : courseMapping[selectedGrade];

      setFormData(prev => ({
        ...prev,
        grade: selectedGrade,
        stream: initialStream,
        subject: availableSubjects[0]
      }));
    }
  }, [selectedGrade]);

  const fetchResources = async (grade) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost/Entrance_Guide_api/admin_grades.php?grade=${grade}`);
      const data = await response.json();
      if (data.success) {
        setResources(data.resources);
      }
    } catch (err) {
      console.error("Failed to fetch resources", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => {
      const newData = { ...prev, [name]: value };

      // If grade or stream changes, update the subject list and reset selection to the first available subject
      if (name === "grade" || name === "stream") {
        const isAdvanced = newData.grade === "grade11" || newData.grade === "grade12";
        const subjects = isAdvanced
          ? courseMapping[newData.grade][newData.stream || "natural"]
          : courseMapping[newData.grade];
        newData.subject = subjects[0];
      }

      return newData;
    });
  };

  const currentSubjects = () => {
    if (!formData.grade) return [];
    const isAdvanced = formData.grade === "grade11" || formData.grade === "grade12";
    return isAdvanced
      ? courseMapping[formData.grade][formData.stream || "natural"]
      : courseMapping[formData.grade];
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file && !editingResource) {
      alert("Please select a file to upload");
      return;
    }

    const data = new FormData();
    if (editingResource) {
      data.append("id", editingResource.id);
    }
    data.append("grade", formData.grade);
    data.append("book_type", formData.book_type);
    data.append("subject", formData.subject);
    if (formData.stream) {
      data.append("stream", formData.stream);
    }
    if (file) {
      data.append("file", file);
    }

    try {
      setUploading(true);
      const response = await fetch("http://localhost/Entrance_Guide_api/admin_grades.php", {
        method: "POST",
        body: data,
      });
      const result = await response.json();
      if (result.success) {
        alert(editingResource ? "Resource updated successfully!" : "Resource uploaded successfully!");
        setFile(null);
        setEditingResource(null);
        e.target.reset();
        fetchResources(formData.grade);
      } else {
        alert(result.message);
      }
    } catch (err) {
      alert("Error saving resource");
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (resource) => {
    setEditingResource(resource);
    setFormData({
      grade: resource.grade,
      book_type: resource.book_type,
      subject: resource.subject,
      stream: resource.stream || "",
    });
    // Scroll to form
    const formElement = document.querySelector('.grade-form-container');
    if (formElement) formElement.scrollIntoView({ behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingResource(null);
    setFormData({
      ...formData,
      subject: currentSubjects()[0] || ""
    });
    setFile(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this resource?")) {
      try {
        const response = await fetch("http://localhost/Entrance_Guide_api/admin_grades.php", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        const data = await response.json();
        if (data.success) {
          setResources(resources.filter((res) => res.id !== id));
        }
      } catch (err) {
        alert("Error deleting resource");
      }
    }
  };

  const renderGradeSelection = () => (
    <div className="grade-selection-view">
      <div className="user-management-header">
        <h2>Grade Management</h2>
        <p>Select a grade to manage its educational resources and books.</p>
      </div>
      <div className="grade-links-grid">
        {grades.map((grade) => (
          <div
            key={grade}
            className="grade-card-link"
            onClick={() => setSelectedGrade(grade)}
          >
            <div className="grade-icon">📚</div>
            <h3>{grade.toUpperCase()}</h3>
            <span>Manage Content</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderGradeDetail = () => (
    <div className="grade-detail-view">
      <div className="section-header">
        <button className="btn-back" onClick={() => setSelectedGrade(null)}>← All Grades</button>
        <h2>Managing {selectedGrade.toUpperCase()}</h2>
      </div>

      <div className="grade-form-container">
        <h3>{editingResource ? `✏️ Edit Resource for ${selectedGrade.toUpperCase()}` : `📤 Add New Resource for ${selectedGrade.toUpperCase()}`}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Grade</label>
              <select name="grade" value={formData.grade || ""} onChange={handleInputChange}>
                <option value="" disabled>Select Grade</option>
                {grades.map(g => <option key={g} value={g}>{g.toUpperCase()}</option>)}
              </select>
            </div>

            {(formData.grade === "grade11" || formData.grade === "grade12") && (
              <div className="form-group">
                <label>Science Stream</label>
                <select name="stream" value={formData.stream || "natural"} onChange={handleInputChange}>
                  <option value="natural">Natural Science</option>
                  <option value="social">Social Science</option>
                </select>
              </div>
            )}

            <div className="form-group">
              <label>Book Type</label>
              <select name="book_type" value={formData.book_type || "Galaxy"} onChange={handleInputChange}>
                {bookTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Subject</label>
              <select name="subject" value={formData.subject || ""} onChange={handleInputChange}>
                <option value="" disabled>Select Subject</option>
                {currentSubjects().map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>File {editingResource ? "(Optional)" : "(PDF/Image)"}</label>
              <input type="file" onChange={handleFileChange} required={!editingResource} />
            </div>
          </div>
          <div className="upload-btn-container" style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn-upload" disabled={uploading}>
              {uploading ? "Saving..." : editingResource ? "Update Resource" : "Save Resource"}
            </button>
            {editingResource && (
              <button type="button" className="btn-delete" onClick={cancelEdit} style={{ background: '#6b7280', padding: '10px 20px', border: 'none', borderRadius: '4px', color: 'white', cursor: 'pointer' }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="resource-list-section">
        <h3>Existing Resources</h3>
        <div className="resource-table-wrapper">
          <table className="resource-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Stream</th>
                <th>Book Type</th>
                <th>File</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" style={{ textAlign: 'center' }}>Loading resources...</td></tr>
              ) : resources.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '30px' }}>No resources found for this grade.</td></tr>
              ) : (
                resources.map(res => (
                  <tr key={res.id}>
                    <td><strong>{res.subject}</strong></td>
                    <td>{res.stream ? <span className="badge badge-questions" style={{ fontSize: '0.7rem' }}>{res.stream}</span> : "-"}</td>
                    <td><span className="book-badge">{res.book_type}</span></td>
                    <td>
                      <a href={res.file_url} target="_blank" rel="noreferrer" style={{ color: '#2563eb' }}>View Document</a>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button className="btn-view-small" style={{ backgroundColor: '#10b981' }} onClick={() => handleEdit(res)}>Edit</button>
                        <button className="btn-delete-small" onClick={() => handleDelete(res.id)}>Delete</button>
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

  return (
    <div className="grade-management-container">
      {!selectedGrade ? renderGradeSelection() : renderGradeDetail()}
    </div>
  );
};

export default GradeManagement;
