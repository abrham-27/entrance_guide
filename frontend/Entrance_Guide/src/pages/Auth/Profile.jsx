import React, { useState } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./Auth.css";
import toast from "react-hot-toast";

const Profile = () => {
  let stored = {};
  try {
    const data = localStorage.getItem("user");
    stored = data ? JSON.parse(data) : {};
  } catch (e) {
    console.error("Failed to parse user", e);
  }
  const [formData, setFormData] = useState({
    firstName: stored.firstName || "",
    lastName: stored.lastName || "",
    email: stored.email || "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost/Entrance_Guide_api/update_profile.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const result = await response.json();
      if (result.success) {
        toast.success("Profile updated");
        localStorage.setItem("user", JSON.stringify(result.user));
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Could not update profile");
    }
  };

  return (
    <div className="auth-page">
      <Header />
      <section className="auth-section">
        <h2>My Profile</h2>
        <form onSubmit={handleSubmit} className="auth-form profile-form">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Leave blank to keep current"
            />
          </div>
          <button type="submit" className="auth-btn">
            Update Profile
          </button>
        </form>
      </section>
      <Footer />
    </div>
  );
};

export default Profile;
