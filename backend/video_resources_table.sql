CREATE TABLE video_resources (
    id INT AUTO_INCREMENT PRIMARY KEY,
    grade VARCHAR(20) NOT NULL,
    stream VARCHAR(50) DEFAULT NULL,
    subject VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    video_url VARCHAR(255) NOT NULL, -- This could be a YouTube URL or internal file path
    is_external BOOLEAN DEFAULT TRUE, -- TRUE for YouTube/Vimeo, FALSE for local file
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
