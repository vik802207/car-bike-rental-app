import React, { useState, useRef, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { FaUserCircle, FaBell } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNotifications } from "../context/NotificationContext";
import './ProfileSidebar.css';
import { useNavigate } from "react-router-dom";

const ProfileSidebar = () => {
  const [open, setOpen] = useState(false);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [showNotifSidebar, setShowNotifSidebar] = useState(false);
  const notifBtnRef = useRef(null);
  const panelRef = useRef(null);
  const navigate=useNavigate();
  const user = getAuth().currentUser;
  const { notifications, markAllAsRead, clearAll } = useNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleSidebar = () => setOpen(!open);

  const toggleNotifications = () => {
    setShowNotifPanel(!showNotifPanel);
    if (!showNotifPanel) markAllAsRead();
  };

  const toggleNotifSidebar = () => {
    setShowNotifSidebar(true);
    markAllAsRead();
  };

  // Close panel if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        !notifBtnRef.current.contains(e.target)
      ) {
        setShowNotifPanel(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div>
      {/* Profile Icon Button */}
      <button onClick={toggleSidebar} title="Profile" style={profileBtnStyle}>
        {user?.photoURL ? (
          <img src={user.photoURL} alt="Profile" style={profileIconStyle} />
        ) : (
          <FaUserCircle size={40} color="#555" />
        )}
      </button>

      <div ref={notifBtnRef} style={{ position: "absolute", top: 0, right: 50 }}>
        <button onClick={toggleNotifications} style={bellBtnStyle}>
          <FaBell size={22} />
          {unreadCount > 0 && <span style={notifBadgeStyle}>{unreadCount}</span>}
        </button>
      </div>

      {showNotifPanel && (
        <div ref={panelRef} style={notifPanelStyle}>
          <h4 style={{ margin: "6px 0", borderBottom: "1px solid #ddd" }}>Notifications</h4>
          {notifications.length === 0 ? (
            <p style={{ fontSize: "14px", color: "#666" }}>No new notifications</p>
          ) : (
            notifications.map((n, i) => (
              <p key={i} style={{ fontSize: "14px", color: n.read ? "#999" : "#000", margin: "4px 0" }}>
                {n.msg}
              </p>
            ))
          )}
        </div>
      )}

      {/* Right Sidebar */}
      <div style={{
        position: "fixed",
        top: 0,
        right: open ? "0px" : "-350px",
        height: "100vh",
        width: "300px",
        background: "#fff",
        boxShadow: "-2px 0 6px rgba(0,0,0,0.1)",
        transition: "right 0.3s ease",
        zIndex: 999,
        padding: "20px",
      }}>
        <button onClick={toggleSidebar} style={closeBtnStyle}>❌</button>

        <div style={{ textAlign: "center", marginTop: "40px" }}>
          {user?.photoURL ? (
            <img src={user.photoURL} alt="User" style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover" }} />
          ) : (
            <FaUserCircle size={80} color="#555" />
          )}
          <h3 style={{ marginTop: "10px" }}>{user?.displayName || "Username"}</h3>
          <p>{user?.email}</p>

          <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "10px" }}>
            <Link to="/editprofile"><button style={btnStyleBlue}>✏️ Edit Profile</button></Link>
            <button style={btnStyleGreen}>👁️ View Profile</button>
          </div>
        </div>

        <hr style={{ margin: "20px 0" }} />
        <ul style={{ listStyle: "none", padding: 0 }}>
        <li style={menuStyle} onClick={toggleNotifSidebar}>🔔 Notifications</li>
          <li style={menuStyle} onClick={() => navigate('/mycoupons')}>🎁 My Coupons</li>
          <li style={menuStyle}>⚙️ Settings</li>
          <li style={menuStyle}>🚪 Logout</li>
        </ul>
      </div>

      {/* Left Notification Sidebar */}
      {showNotifSidebar && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "20vh",
          width: "300px",
          background: "#fff",
          boxShadow: "2px 0 6px rgba(0,0,0,0.1)",
          zIndex: 999,
          padding: "20px",
          overflow:"auto",
          overflowY:"auto",

        }}>
          <button onClick={() => setShowNotifSidebar(false)} style={closeBtnStyle}>❌</button>
          <h3 style={{ marginBottom: "10px", borderBottom: "1px solid #ddd" }}>Notifications</h3>

          {/* Buttons */}
          {notifications.length > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
              <button onClick={markAllAsRead} style={btnMini}>✔️ Mark all read</button>
              <button onClick={clearAll} style={{ ...btnMini, backgroundColor: "#f87171" }}>
                🗑️ Clear all
              </button>
            </div>
          )}

          {/* Notification List */}
          {notifications.length === 0 ? (
            <p style={{ fontSize: "14px", color: "#666" }}>No notifications</p>
          ) : (
            notifications.map((n, i) => (
              <p
                key={i}
                style={{
                  fontSize: "14px",
                  color: n.read ? "#999" : "#000",
                  margin: "8px 0",
                  padding: "6px",
                  background: n.read ? "#f9f9f9" : "#eef",
                  borderRadius: "4px",
                }}
              >
                {n.msg}
              </p>
            ))
          )}
        </div>
      )}
    </div>
  );
};

// Styles
const profileBtnStyle = {
  position: "absolute",
  top: 0,
  right: 0,
  width: 40,
  height: 40,
  borderRadius: "50%",
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
};

const profileIconStyle = {
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  objectFit: "cover",
  backgroundColor: "#eee",
};

const bellBtnStyle = {
  position: "relative",
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: "8px",
};

const notifBadgeStyle = {
  position: "absolute",
  top: 2,
  right: 2,
  background: "red",
  color: "white",
  borderRadius: "50%",
  fontSize: "10px",
  padding: "2px 5px",
};

const notifPanelStyle = {
  position: "absolute",
  top: 45,
  right: 0,
  width: "240px",
  background: "#fff",
  border: "1px solid #ddd",
  borderRadius: "8px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  padding: "10px",
  zIndex: 1000,
};

const closeBtnStyle = {
  position: "absolute",
  top: 10,
  right: 10,
  background: "none",
  border: "none",
  fontSize: "20px",
  cursor: "pointer",
};

const btnStyleBlue = {
  padding: "6px 12px",
  backgroundColor: "#4f46e5",
  color: "#fff",
  borderRadius: "4px",
  border: "none",
  cursor: "pointer",
};

const btnStyleGreen = {
  padding: "6px 12px",
  backgroundColor: "#10b981",
  color: "#fff",
  borderRadius: "4px",
  border: "none",
  cursor: "pointer",
};

const menuStyle = {
  padding: "12px 0",
  cursor: "pointer",
  borderBottom: "1px solid #eee",
};

const btnMini = {
  padding: "4px 8px",
  fontSize: "12px",
  backgroundColor: "#60a5fa",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

export default ProfileSidebar;
