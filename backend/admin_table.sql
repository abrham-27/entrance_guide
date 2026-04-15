-- Create the admin table
CREATE TABLE admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    country VARCHAR(50) NOT NULL,
    region VARCHAR(50) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL -- Store hashed password
);

-- Insert the admin account (password should be hashed in PHP before insertion)
-- For now, inserting plain text; hash it in your PHP code
INSERT INTO admin (first_name, last_name, country, region, phone, email, password)
VALUES ('Abrham', 'Tesfa', 'Ethiopia', 'Amhara', '0946141401', 'tesfaabrham299@gmail.com', 'abrham123');

-- Note: In production, hash the password using password_hash() in PHP before inserting.