import React, { useState, useEffect } from "react";
import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import "./Video.css";

const VideoViewer = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    let user = null;
    try {
        const stored = localStorage.getItem("user");
        user = stored ? JSON.parse(stored) : null;
    } catch (e) {
        console.error("Failed to parse user", e);
    }

    // Path format: /video/:grade/:subject OR /video/:grade/:stream/:subject
    const parts = window.location.pathname.split("/");
    let grade, stream = null, subjectSlug;
    
    if (parts.length > 4) {
        grade = parts[2];
        stream = parts[3];
        subjectSlug = parts[4];
    } else {
        grade = parts[2];
        subjectSlug = parts[3];
    }

    const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    useEffect(() => {
        if (!user) {
            setError("You must be logged in to access video guides.");
            setLoading(false);
            return;
        }
        fetchVideos();
    }, [grade, stream, subjectSlug]);

    const fetchVideos = async () => {
        try {
            setLoading(true);
            let url = `http://localhost/Entrance_Guide_api/admin_videos.php?grade=${grade}`;
            if (stream) url += `&stream=${stream}`;
            
            const response = await fetch(url);
            const data = await response.json();

            if (data.success && data.videos.length > 0) {
                const filtered = data.videos.filter(v => normalize(v.subject) === subjectSlug);
                setVideos(filtered);
            } else {
                setVideos([]);
            }
        } catch (err) {
            setError("Failed to connect to the server.");
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="video-page">
                <Header />
                <section className="video-section">
                    <div className="auth-alert-center">
                        <h2>🔒 Members Only Content</h2>
                        <p>We provide exclusive video guides for our registered students.</p>
                        <a href="/login" className="btn-login-cta">Sign In to Watch</a>
                        <p className="small">Don't have an account? <a href="/signup">Sign up here</a></p>
                    </div>
                </section>
                <Footer />
            </div>
        );
    }

    return (
        <div className="video-page">
            <Header />
            <section className="video-section">
                <div className="viewer-header">
                    <a href={`/video/${grade}`} className="back-link">← Back to Courses</a>
                    <h2>{grade.toUpperCase()} {stream && `(${stream})`} - Video Tutorials</h2>
                    <p className="subject-title">Subject: {subjectSlug.charAt(0).toUpperCase() + subjectSlug.slice(1).replace(/-/g, ' ')}</p>
                </div>

                <div className="video-list-container">
                    {loading ? (
                        <div className="loader">Fetching educational videos...</div>
                    ) : videos.length === 0 ? (
                        <div className="no-videos">
                            <p>📺 No videos uploaded for this subject yet.</p>
                            <p className="hint">Our teachers are currently recording new lessons. Stay tuned!</p>
                        </div>
                    ) : (
                        <div className="video-cards-grid">
                            {videos.map((vid) => (
                                <div key={vid.id} className="video-playback-card">
                                    <div className="video-player">
                                        {vid.is_external == 1 ? (
                                            vid.video_url.includes('youtube.com') || vid.video_url.includes('youtu.be') ? (
                                                <iframe 
                                                    src={`https://www.youtube.com/embed/${vid.video_url.split('v=')[1]?.split('&')[0] || vid.video_url.split('/').pop()}`}
                                                    title={vid.title}
                                                    frameBorder="0"
                                                    allowFullScreen
                                                ></iframe>
                                            ) : (
                                                <div className="external-link-placeholder">
                                                    <a href={vid.video_url} target="_blank" rel="noreferrer">Open External Video ↗</a>
                                                </div>
                                            )
                                        ) : (
                                            <video src={vid.full_video_url} controls />
                                        )}
                                    </div>
                                    <div className="playback-info">
                                        <h3>{vid.title}</h3>
                                        <span className="upload-date">Recorded: {new Date(vid.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default VideoViewer;
