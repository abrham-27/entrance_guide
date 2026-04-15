<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Fetch all users
        $sql = "SELECT id, first_name, father_name, email, phone, country, region, school, created_at FROM users ORDER BY created_at DESC";
        $result = $conn->query($sql);
        
        $users = [];
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $users[] = $row;
            }
        }
        echo json_encode(['success' => true, 'users' => $users]);
        break;

    case 'DELETE':
        // Delete a user
        $data = json_decode(file_get_contents("php://input"), true);
        if (isset($data['id'])) {
            $id = $conn->real_escape_string($data['id']);
            $sql = "DELETE FROM users WHERE id = '$id'";
            if ($conn->query($sql) === TRUE) {
                echo json_encode(['success' => true, 'message' => 'User deleted successfully']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Error deleting user: ' . $conn->error]);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'No ID provided']);
        }
        break;

    case 'PUT':
        // Update a user (basic implementation)
        $data = json_decode(file_get_contents("php://input"), true);
        if (isset($data['id'])) {
            $id = $conn->real_escape_string($data['id']);
            $first_name = $conn->real_escape_string($data['first_name']);
            $father_name = $conn->real_escape_string($data['father_name']);
            $email = $conn->real_escape_string($data['email']);
            $phone = $conn->real_escape_string($data['phone']);
            
            $sql = "UPDATE users SET first_name='$first_name', father_name='$father_name', email='$email', phone='$phone' WHERE id='$id'";
            if ($conn->query($sql) === TRUE) {
                echo json_encode(['success' => true, 'message' => 'User updated successfully']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Error updating user: ' . $conn->error]);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'No ID provided']);
        }
        break;

    default:
        echo json_encode(['success' => false, 'message' => 'Invalid request method']);
        break;
}

$conn->close();
?>
