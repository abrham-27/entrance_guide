CREATE TABLE grade_resources (
    id INT AUTO_INCREMENT PRIMARY KEY,
    grade VARCHAR(20) NOT NULL,
    stream VARCHAR(50) DEFAULT NULL, -- Null for Grade 9/10, "natural" or "social" for 11/12
    book_type VARCHAR(50) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
