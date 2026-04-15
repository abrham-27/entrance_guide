import React, { useState, useEffect } from "react";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import "./StudentDashboard.css";

const StudentDashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      window.location.href = '/login';
    }
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-page">
      <Header />
      <main className="dashboard-main">
        <h1>Welcome to your Dashboard, {user.firstName}!</h1>
        <p>Here you can access your personalized content.</p>
        {/* Add dashboard content here */}
      </main>
      <Footer />
    </div>
  );
};

export default StudentDashboard;