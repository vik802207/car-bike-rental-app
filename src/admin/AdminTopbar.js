import React, { useState } from "react";
import { FaBell, FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";
import "./AdminTopbar.css";
import { useNavigate } from "react-router-dom";
const AdminTopbar = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const email=props.email;
  const name=props.name;
  const photoURL=props.photoURL;
  const navigate=useNavigate();

  return (
    <>
      <div className="admin-topbar">
        <FaBell className="top-icon" title="Notifications" />
       {photoURL ? (
  <img
    src={photoURL}
    alt="Profile"
    className="top-avatar"
    onClick={() => setIsOpen(true)}
    title="Profile"
  />
) : (
  <FaUser className="top-icon" title="Profile" onClick={() => setIsOpen(true)} />
)}

      </div>

      <div className={`sidebar-panel ${isOpen ? "show" : ""}`}>
       <div className="sidebar-header">
  {photoURL ? (
    <img src={photoURL} alt="Profile" className="sidebar-user-image" />
  ) : (
    <FaUser className="sidebar-user-icon" />
  )}
  <div className="admin-info">
    <h4>{name ? name : "Admin"}</h4>
    {email && <p className="email-text" style={{margin:"0px"}}>{email}</p>}
  </div>
</div>



        <ul className="sidebar-links">
           <li onClick={() => navigate("/admin-profile")}><FaUser /> Profile</li>
          <li><FaBell /> Notifications</li>
          <li><FaCog /> Settings</li>
          <li onClick={() => navigate("/admin-signup")}><FaSignOutAlt /> Logout</li>
        </ul>

        <button className="sidebar-close" onClick={() => setIsOpen(false)}>Close</button>
      </div>
    </>
  );
};

export default AdminTopbar;
