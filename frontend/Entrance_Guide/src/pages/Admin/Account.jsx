import React from "react";
import "./Admin.css";

const Account = () => {
  let user = {};
  try {
    const data = localStorage.getItem("user");
    user = data ? JSON.parse(data) : {};
  } catch (e) {
    console.error("Failed to parse user", e);
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="account-content">
          <h2>Account Information</h2>
          <p>
            <strong>Name:</strong> {user.firstName} {user.lastName}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          {/* Additional account details can go here */}
        </div>
      </div>
    </div>
  );
};

export default Account;
