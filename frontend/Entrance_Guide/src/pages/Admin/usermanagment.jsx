import React, { useState, useEffect } from "react";
import "./usermanagment.css";

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newUser, setNewUser] = useState({
        first_name: "",
        father_name: "",
        email: "",
        phone: "",
        region: "",
        school: "",
        password: "",
    });

    const regions = [
        "Addis Ababa", "Afar", "Amhara", "Benishangul-Gumuz", "Dire Dawa", "Gambela",
        "Harari", "Oromia", "Sidama", "Somali", "South West Ethiopia Peoples",
        "Southern Nations", "Tigray",
    ];

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await fetch("http://localhost/Entrance_Guide_api/admin_users.php");
            const data = await response.json();
            if (data.success) {
                setUsers(data.users);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError("Failed to fetch users. Please make sure your backend is running.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                const response = await fetch("http://localhost/Entrance_Guide_api/admin_users.php", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id }),
                });
                const data = await response.json();
                if (data.success) {
                    setUsers(users.filter((user) => user.id !== id));
                    alert("User deleted successfully");
                } else {
                    alert(data.message);
                }
            } catch (err) {
                alert("Error deleting user");
            }
        }
    };

    const handleUpdate = (user) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };

    const handleView = (user) => {
        setSelectedUser(user);
        setIsViewModalOpen(true);
    };

    const closeModals = () => {
        setIsEditModalOpen(false);
        setIsViewModalOpen(false);
        setIsAddModalOpen(false);
        setSelectedUser(null);
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost/Entrance_Guide_api/admin_users.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newUser),
            });
            const data = await response.json();
            if (data.success) {
                alert("User added successfully");
                fetchUsers();
                setIsAddModalOpen(false);
                setNewUser({
                    first_name: "",
                    father_name: "",
                    email: "",
                    phone: "",
                    region: "",
                    school: "",
                    password: "",
                });
            } else {
                alert(data.message);
            }
        } catch (err) {
            alert("Error adding user");
        }
    };

    const handleNewUserChange = (e) => {
        const { name, value } = e.target;
        setNewUser({ ...newUser, [name]: value });
    };

    const handleSaveUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost/Entrance_Guide_api/admin_users.php", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(selectedUser),
            });
            const data = await response.json();
            if (data.success) {
                setUsers(users.map((u) => (u.id === selectedUser.id ? selectedUser : u)));
                setIsEditModalOpen(false);
                alert("User updated successfully");
            } else {
                alert(data.message);
            }
        } catch (err) {
            alert("Error updating user");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedUser({ ...selectedUser, [name]: value });
    };

    if (loading) return <div className="loading-spinner">Loading users...</div>;
    if (error) return <div className="loading-spinner text-red-500">{error}</div>;

    return (
        <div className="user-management-container">
            <div className="user-management-header">
                <div>
                    <h2>User Management</h2>
                    <span className="user-count">{users.length} Users Registered</span>
                </div>
                <button className="btn-add-user" onClick={() => setIsAddModalOpen(true)}>
                    + Add New User
                </button>
            </div>

            <div className="users-table-wrapper">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Phone</th>
                            <th>Location</th>
                            <th>School</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>
                                    <div className="user-info">
                                        <span className="user-name">
                                            {user.first_name} {user.father_name}
                                        </span>
                                        <span className="user-email">{user.email}</span>
                                    </div>
                                </td>
                                <td>{user.phone}</td>
                                <td>
                                    {user.region}, {user.country}
                                </td>
                                <td>{user.school}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="btn-action btn-view" onClick={() => handleView(user)}>
                                            View
                                        </button>
                                        <button className="btn-action btn-update" onClick={() => handleUpdate(user)}>
                                            Update
                                        </button>
                                        <button className="btn-action btn-delete" onClick={() => handleDelete(user.id)}>
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Update User Details</h3>
                        </div>
                        <form onSubmit={handleSaveUpdate}>
                            <div className="form-group">
                                <label>First Name</label>
                                <input
                                    type="text"
                                    name="first_name"
                                    value={selectedUser.first_name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Father Name</label>
                                <input
                                    type="text"
                                    name="father_name"
                                    value={selectedUser.father_name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={selectedUser.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={selectedUser.phone}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-cancel" onClick={closeModals}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-save">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add User Modal */}
            {isAddModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Add New User</h3>
                        </div>
                        <form onSubmit={handleAddUser}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>First Name</label>
                                    <input type="text" name="first_name" value={newUser.first_name} onChange={handleNewUserChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Father Name</label>
                                    <input type="text" name="father_name" value={newUser.father_name} onChange={handleNewUserChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input type="email" name="email" value={newUser.email} onChange={handleNewUserChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Phone</label>
                                    <input type="text" name="phone" value={newUser.phone} onChange={handleNewUserChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Region</label>
                                    <select name="region" value={newUser.region} onChange={handleNewUserChange} required>
                                        <option value="">Select Region</option>
                                        {regions.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>School</label>
                                    <input type="text" name="school" value={newUser.school} onChange={handleNewUserChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Password</label>
                                    <input type="password" name="password" value={newUser.password} onChange={handleNewUserChange} required />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-cancel" onClick={closeModals}>Cancel</button>
                                <button type="submit" className="btn-save">Create User</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Modal */}
            {isViewModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>User Details</h3>
                        </div>
                        <div className="user-details">
                            <p><strong>Full Name:</strong> {selectedUser.first_name} {selectedUser.father_name}</p>
                            <p><strong>Email:</strong> {selectedUser.email}</p>
                            <p><strong>Phone:</strong> {selectedUser.phone}</p>
                            <p><strong>Country:</strong> {selectedUser.country}</p>
                            <p><strong>Region:</strong> {selectedUser.region}</p>
                            <p><strong>School:</strong> {selectedUser.school}</p>
                            <p><strong>Registered On:</strong> {new Date(selectedUser.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={closeModals}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
