import React, { useState, useEffect } from "react";
import "./VideoManagement.css";

const grades = ["grade9", "grade10", "grade11", "grade12"];

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

const VideoManagement = () => {
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadType, setUploadType] = useState("url"); // "url" or "file"
  const [formData, setFormData] = useState({
    grade: "",
    subject: "",
    stream: "",
    title: "",
    video_url: "",
  });
  const [file, setFile] = useState(null);
  const [editingVideo, setEditingVideo] = useState(null);

  useEffect(() => {
    if (selectedGrade) {
      fetchVideos(selectedGrade);
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

  const fetchVideos = async (grade) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost/Entrance_Guide_api/admin_videos.php?grade=${grade}`);
      const data = await response.json();
      if (data.success) {
        setVideos(data.videos);
      }
    } catch (err) {
      console.error("Failed to fetch videos", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    if (editingVideo) {
      data.append("id", editingVideo.id);
    }
    data.append("grade", formData.grade);
    data.append("subject", formData.subject);
    data.append("title", formData.title);
    data.append("is_external", uploadType === "url" ? "1" : "0");
    if (formData.stream) data.append("stream", formData.stream);

    if (uploadType === "url") {
      data.append("video_url", formData.video_url);
    } else {
      if (!file) return alert("Please select a video file");
      data.append("file", file);
    }

    try {
      setUploading(true);
      const response = await fetch("http://localhost/Entrance_Guide_api/admin_videos.php", {
        method: "POST",
        body: data,
      });
      const result = await response.json();
      if (result.success) {
        alert(editingVideo ? "Video updated successfully!" : "Video saved successfully!");
        setEditingVideo(null);
        setFormData({ ...formData, title: "", video_url: "" });
        setFile(null);
        fetchVideos(formData.grade);
      } else {
        alert(result.message);
      }
    } catch (err) {
      alert("Error saving video");
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (video) => {
    setEditingVideo(video);
    setUploadType(video.is_external == 1 ? "url" : "file");
    setFormData({
      grade: video.grade,
      subject: video.subject,
      stream: video.stream || "",
      title: video.title,
      video_url: video.is_external == 1 ? video.video_url : "",
    });
    // Scroll to form
    const formElement = document.querySelector('.video-form');
    if (formElement) formElement.scrollIntoView({ behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingVideo(null);
    setFormData({
      ...formData,
      title: "",
      video_url: "",
    });
    setFile(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this video?")) {
      await fetch("http://localhost/Entrance_Guide_api/admin_videos.php", {
        method: "DELETE",
        body: JSON.stringify({ id }),
      });
      fetchVideos(selectedGrade);
    }
  };

  const renderGradeSelection = () => (
    <div className="grade-selection-view">
      <div className="user-management-header">
        <h2>Video Guide Management</h2>
        <p>Manage tutorial videos and guides for each grade.</p>
      </div>
      <div className="grade-links-grid">
        {grades.map((grade) => (
          <div key={grade} className="grade-card-link" onClick={() => setSelectedGrade(grade)}>
            <div className="grade-icon">🎬</div>
            <h3>{grade.toUpperCase()}</h3>
            <span>Manage Videos</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderVideoDetail = () => (
    <div className="grade-detail-view">
      <div className="section-header">
        <button className="btn-back" onClick={() => setSelectedGrade(null)}>← All Grades</button>
        <h2>{selectedGrade.toUpperCase()} Video Content</h2>
      </div>

      <div className="video-form">
        <h3>{editingVideo ? "✏️ Edit Video Guide" : "Upload / Link New Video"}</h3>
        <div className="upload-type-selector">
          <button className={`type-btn ${uploadType === 'url' ? 'active' : ''}`} onClick={() => setUploadType('url')}>YouTube/External URL</button>
          <button className={`type-btn ${uploadType === 'file' ? 'active' : ''}`} onClick={() => setUploadType('file')}>Local File Upload</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Video Title</label>
              <input type="text" name="title" value={formData.title || ""} onChange={handleInputChange} placeholder="e.g. Intro to Calculus" required />
            </div>
            {(formData.grade === "grade11" || formData.grade === "grade12") && (
              <div className="form-group">
                <label>Stream</label>
                <select name="stream" value={formData.stream || "natural"} onChange={handleInputChange}>
                  <option value="natural">Natural</option>
                  <option value="social">Social</option>
                </select>
              </div>
            )}
            <div className="form-group">
              <label>Subject</label>
              <select name="subject" value={formData.subject || ""} onChange={handleInputChange}>
                <option value="" disabled>Select Subject</option>
                {currentSubjects().map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            {uploadType === 'url' ? (
              <div className="form-group">
                <label>YouTube/Video URL</label>
                <input type="url" name="video_url" value={formData.video_url || ""} onChange={handleInputChange} placeholder="https://youtube.com/..." required />
              </div>
            ) : (
              <div className="form-group">
                <label>Video File {editingVideo ? "(Optional)" : ""}</label>
                <input type="file" onChange={(e) => setFile(e.target.files[0])} accept="video/*" required={!editingVideo} />
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn-upload" disabled={uploading}>
              {uploading ? "Saving..." : editingVideo ? "Update Video" : "Add Video Guide"}
            </button>
            {editingVideo && (
              <button type="button" className="btn-delete" onClick={cancelEdit} style={{ background: '#6b7280', padding: '10px 20px', border: 'none', borderRadius: '4px', color: 'white', cursor: 'pointer' }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="video-grid">
        {videos.map(video => (
          <div key={video.id} className="video-card">
            <div className="video-preview">
              {video.is_external == 1 ? (
                <div style={{ color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>🔗 External Link</div>
              ) : (
                <video src={video.full_video_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              )}
            </div>
            <div className="video-info">
              <h4>{video.title}</h4>
              <div className="video-meta">
                <span>{video.subject}</span>
                {video.stream && <span className="book-badge">{video.stream}</span>}
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <a href={video.full_video_url} target="_blank" rel="noreferrer" className="btn-view-small">Watch</a>
                <button className="btn-view-small" style={{ backgroundColor: '#10b981' }} onClick={() => handleEdit(video)}>Edit</button>
                <button className="btn-delete-small" onClick={() => handleDelete(video.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="video-management-container">
      {!selectedGrade ? renderGradeSelection() : renderVideoDetail()}
    </div>
  );
};

export default VideoManagement;
