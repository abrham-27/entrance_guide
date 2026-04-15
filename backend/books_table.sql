CREATE TABLE books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    book_name VARCHAR(150) NOT NULL,
    grade ENUM('grade9', 'grade10', 'grade11', 'grade12') NOT NULL,
    stream ENUM('natural', 'social') DEFAULT NULL,
    description TEXT NOT NULL,
    cover_image_name VARCHAR(255) NOT NULL,
    cover_image_path VARCHAR(255) NOT NULL,
    is_published TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_book_per_grade_stream (book_name, grade, stream)
);
