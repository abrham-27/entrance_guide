<?php
require_once 'config.php';

header('Content-Type: application/json');

function respond($success, $payload = []) {
    echo json_encode(array_merge(['success' => $success], $payload));
    exit;
}

function normalize_grade($grade) {
    $grade = strtolower(trim((string)$grade));
    $allowed = ['grade9', 'grade10', 'grade11', 'grade12'];
    return in_array($grade, $allowed, true) ? $grade : null;
}

function normalize_stream($stream, $grade) {
    $stream = strtolower(trim((string)$stream));

    if ($grade === 'grade11' || $grade === 'grade12') {
        if ($stream === 'natural' || $stream === 'social') {
            return $stream;
        }
        return null;
    }

    return null;
}

function build_cover_url($relativePath) {
    if (!$relativePath) {
        return null;
    }

    $isHttps = (
        (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ||
        (isset($_SERVER['SERVER_PORT']) && (string)$_SERVER['SERVER_PORT'] === '443')
    );

    $scheme = $isHttps ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'] ?? 'localhost';

    $scriptDir = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? ''));
    $scriptDir = rtrim($scriptDir, '/');

    return $scheme . '://' . $host . $scriptDir . '/' . ltrim(str_replace('\\', '/', $relativePath), '/');
}

function delete_cover_if_exists($relativePath) {
    if (!$relativePath) {
        return;
    }

    $fullPath = __DIR__ . DIRECTORY_SEPARATOR . str_replace(['/', '\\'], DIRECTORY_SEPARATOR, $relativePath);
    if (file_exists($fullPath) && is_file($fullPath)) {
        @unlink($fullPath);
    }
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $grade = isset($_GET['grade']) ? normalize_grade($_GET['grade']) : null;
    $stream = isset($_GET['stream']) ? strtolower(trim((string)$_GET['stream'])) : null;

    $sql = "SELECT id, book_name, grade, stream, description, cover_image_name, cover_image_path, created_at, updated_at
            FROM books";
    $conditions = [];
    $params = [];
    $types = '';

    if ($grade) {
        $conditions[] = "grade = ?";
        $params[] = $grade;
        $types .= 's';
    }

    if ($stream !== null && $stream !== '') {
        $conditions[] = "stream = ?";
        $params[] = $stream;
        $types .= 's';
    }

    if (!empty($conditions)) {
        $sql .= " WHERE " . implode(" AND ", $conditions);
    }

    $sql .= " ORDER BY created_at DESC";

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        respond(false, ['message' => 'Failed to prepare query: ' . $conn->error]);
    }

    if (!empty($params)) {
        $stmt->bind_param($types, ...$params);
    }

    if (!$stmt->execute()) {
        respond(false, ['message' => 'Failed to fetch books: ' . $stmt->error]);
    }

    $result = $stmt->get_result();
    $books = [];

    while ($row = $result->fetch_assoc()) {
        $row['cover_url'] = build_cover_url($row['cover_image_path']);
        $books[] = $row;
    }

    $stmt->close();
    respond(true, ['books' => $books]);
}

if ($method === 'POST') {
    $id = isset($_POST['id']) ? (int)$_POST['id'] : null;
    $bookName = trim((string)($_POST['book_name'] ?? ''));
    $grade = normalize_grade($_POST['grade'] ?? '');
    $description = trim((string)($_POST['description'] ?? ''));
    $stream = normalize_stream($_POST['stream'] ?? '', $grade);

    if ($bookName === '' || !$grade || $description === '') {
        respond(false, ['message' => 'Book name, grade, and description are required.']);
    }

    if (($grade === 'grade11' || $grade === 'grade12') && !$stream) {
        respond(false, ['message' => 'Stream is required for Grade 11 and Grade 12.']);
    }

    if (($grade === 'grade9' || $grade === 'grade10')) {
        $stream = null;
    }

    $hasFile = isset($_FILES['cover_page']) && isset($_FILES['cover_page']['tmp_name']) && $_FILES['cover_page']['error'] !== UPLOAD_ERR_NO_FILE;

    if (!$id && !$hasFile) {
        respond(false, ['message' => 'Cover page is required when creating a new book.']);
    }

    $existingBook = null;
    if ($id) {
        $existingStmt = $conn->prepare("SELECT id, cover_image_name, cover_image_path FROM books WHERE id = ?");
        if (!$existingStmt) {
            respond(false, ['message' => 'Failed to prepare existing book query: ' . $conn->error]);
        }

        $existingStmt->bind_param("i", $id);
        $existingStmt->execute();
        $existingResult = $existingStmt->get_result();
        $existingBook = $existingResult->fetch_assoc();
        $existingStmt->close();

        if (!$existingBook) {
            respond(false, ['message' => 'Book not found.']);
        }
    }

    $coverImageName = $existingBook['cover_image_name'] ?? null;
    $coverImagePath = $existingBook['cover_image_path'] ?? null;

    if ($hasFile) {
        if ($_FILES['cover_page']['error'] !== UPLOAD_ERR_OK) {
            respond(false, ['message' => 'File upload failed.']);
        }

        $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
        $originalName = $_FILES['cover_page']['name'];
        $extension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));

        if (!in_array($extension, $allowedExtensions, true)) {
            respond(false, ['message' => 'Only JPG, JPEG, PNG, WEBP, and GIF files are allowed.']);
        }

        $uploadDir = __DIR__ . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR . 'books';
        if (!is_dir($uploadDir) && !mkdir($uploadDir, 0777, true)) {
            respond(false, ['message' => 'Failed to create upload directory.']);
        }

        $safeBaseName = preg_replace('/[^a-zA-Z0-9_-]+/', '-', strtolower($bookName));
        $safeBaseName = trim($safeBaseName, '-');
        if ($safeBaseName === '') {
            $safeBaseName = 'book-cover';
        }

        $generatedName = $safeBaseName . '-' . time() . '-' . mt_rand(1000, 9999) . '.' . $extension;
        $destinationPath = $uploadDir . DIRECTORY_SEPARATOR . $generatedName;

        if (!move_uploaded_file($_FILES['cover_page']['tmp_name'], $destinationPath)) {
            respond(false, ['message' => 'Failed to save uploaded cover image.']);
        }

        if ($existingBook && !empty($existingBook['cover_image_path'])) {
            delete_cover_if_exists($existingBook['cover_image_path']);
        }

        $coverImageName = $originalName;
        $coverImagePath = 'uploads/books/' . $generatedName;
    }

    if ($id) {
        $stmt = $conn->prepare("
            UPDATE books
            SET book_name = ?, grade = ?, stream = ?, description = ?, cover_image_name = ?, cover_image_path = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        ");

        if (!$stmt) {
            respond(false, ['message' => 'Failed to prepare update query: ' . $conn->error]);
        }

        $stmt->bind_param(
            "ssssssi",
            $bookName,
            $grade,
            $stream,
            $description,
            $coverImageName,
            $coverImagePath,
            $id
        );

        if ($stmt->execute()) {
            $stmt->close();
            respond(true, ['message' => 'Book updated successfully.']);
        }

        $stmt->close();
        respond(false, ['message' => 'Failed to update book: ' . $conn->error]);
    }

    $stmt = $conn->prepare("
        INSERT INTO books (book_name, grade, stream, description, cover_image_name, cover_image_path)
        VALUES (?, ?, ?, ?, ?, ?)
    ");

    if (!$stmt) {
        respond(false, ['message' => 'Failed to prepare insert query: ' . $conn->error]);
    }

    $stmt->bind_param(
        "ssssss",
        $bookName,
        $grade,
        $stream,
        $description,
        $coverImageName,
        $coverImagePath
    );

    if ($stmt->execute()) {
        $stmt->close();
        respond(true, ['message' => 'Book created successfully.']);
    }

    $stmt->close();
    respond(false, ['message' => 'Failed to create book: ' . $conn->error]);
}

if ($method === 'DELETE') {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = isset($data['id']) ? (int)$data['id'] : 0;

    if ($id <= 0) {
        respond(false, ['message' => 'A valid book ID is required.']);
    }

    $findStmt = $conn->prepare("SELECT cover_image_path FROM books WHERE id = ?");
    if (!$findStmt) {
        respond(false, ['message' => 'Failed to prepare delete lookup query: ' . $conn->error]);
    }

    $findStmt->bind_param("i", $id);
    $findStmt->execute();
    $findResult = $findStmt->get_result();
    $book = $findResult->fetch_assoc();
    $findStmt->close();

    if (!$book) {
        respond(false, ['message' => 'Book not found.']);
    }

    $deleteStmt = $conn->prepare("DELETE FROM books WHERE id = ?");
    if (!$deleteStmt) {
        respond(false, ['message' => 'Failed to prepare delete query: ' . $conn->error]);
    }

    $deleteStmt->bind_param("i", $id);

    if ($deleteStmt->execute()) {
        $deleteStmt->close();
        if (!empty($book['cover_image_path'])) {
            delete_cover_if_exists($book['cover_image_path']);
        }
        respond(true, ['message' => 'Book deleted successfully.']);
    }

    $deleteStmt->close();
    respond(false, ['message' => 'Failed to delete book: ' . $conn->error]);
}

respond(false, ['message' => 'Invalid request method.']);
?>
