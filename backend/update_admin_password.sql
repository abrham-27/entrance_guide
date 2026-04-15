-- Update admin password to hashed version
UPDATE admin SET password = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' WHERE email = 'tesfaabrham299@gmail.com';
-- This is the hash for 'abrham123' using password_hash(PASSWORD_DEFAULT)