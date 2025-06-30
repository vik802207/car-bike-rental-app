import React from "react";
import { useNavigate } from "react-router-dom";
import "./ChooseRoleDashboard.css";

const ChooseRoleDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="choose-dashboard">
      <h2 className="choose-title">Login As</h2>

      <div className="choose-cards">
        <div className="choose-card" onClick={() => navigate("/admin-signup")}>
          <img src="https://cdn-icons-png.flaticon.com/512/456/456212.png" alt="Admin" />
          <h3>Admin</h3>
          <p>Manage vehicles, bookings, and users.</p>
        </div>

        <div className="choose-card" onClick={() => navigate("/login")}>
          <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="User" />
          <h3>User</h3>
          <p>Book vehicles and manage your trips.</p>
        </div>
      </div>
    </div>
  );
};

export default ChooseRoleDashboard;
