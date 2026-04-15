import React, { useState, useEffect } from "react";
import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import "../Exams/Exam.css"; // Reuse exam styles for consistency

const BookViewer = () => {
    const [resource, setResource] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Path format: /books/:grade/:course/:bookType OR /books/:grade/:stream/:course/:bookType
    const pathParts = window.location.pathname.split("/");
    let grade, stream = null, subjectSlug, bookTypeSlug;

    if (pathParts.length > 5) {
        grade = pathParts[2];
        stream = pathParts[3];
        subjectSlug = pathParts[4];
        bookTypeSlug = pathParts[5];
    } else {
        grade = pathParts[2];
        subjectSlug = pathParts[3];
        bookTypeSlug = pathParts[4];
    }

    // Helper to match slugs back to display names
    const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    useEffect(() => {
        fetchResource();
    }, [grade, stream, subjectSlug, bookTypeSlug]);

    const fetchResource = async () => {
        try {
            setLoading(true);
            let url = `http://localhost/Entrance_Guide_api/admin_grades.php?grade=${grade}`;
            if (stream) url += `&stream=${stream}`;
            
            const response = await fetch(url);
            const data = await response.json();

            if (data.success && data.resources.length > 0) {
                const matched = data.resources.find(r => 
                    normalize(r.subject) === subjectSlug && 
                    normalize(r.book_type) === bookTypeSlug
                );

                if (matched) {
                    setResource(matched);
                } else {
                    setError("This specific book/resource is not yet available.");
                }
            } else {
                setError("No resources found for this grade.");
            }
        } catch (err) {
            setError("Failed to connect to the server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="exam-page">
            <Header />
            <section className="exam-section viewer-section">
                <div className="viewer-header">
                    <a href={`/courses/${grade}/${subjectSlug}`} className="back-link">
                        ← Back to {subjectSlug.charAt(0).toUpperCase() + subjectSlug.slice(1).replace(/-/g, ' ')}
                    </a>
                    <h2>
                        {grade.toUpperCase()} - {bookTypeSlug.charAt(0).toUpperCase() + bookTypeSlug.slice(1)} ({subjectSlug.charAt(0).toUpperCase() + subjectSlug.slice(1).replace(/-/g, ' ')})
                    </h2>
                </div>

                <div className="viewer-content">
                    {loading ? (
                        <div className="loader">Searching database...</div>
                    ) : error ? (
                        <div className="error-box">
                            <p>⚠️ {error}</p>
                            <p className="small-text">Our team is working on uploading more guides. Check back soon!</p>
                        </div>
                    ) : (
                        <div className="exam-display">
                            {resource.file_path.toLowerCase().endsWith('.pdf') ? (
                                <iframe
                                    src={resource.file_url}
                                    title="Resource Viewer"
                                    width="100%"
                                    height="800px"
                                    style={{ border: 'none', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                            ) : (
                                <img
                                    src={resource.file_url}
                                    alt="Educational Resource"
                                    style={{ maxWidth: '100%', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                            )}
                            <div className="download-area">
                                <a href={resource.file_url} download className="btn-download-pdf">
                                    Download {resource.book_type} PDF
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default BookViewer;
