import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import {
  FaHome,
  FaWallet,
  FaUser,
  FaCar,
  FaBars,
  FaCarSide,
} from "react-icons/fa";

import { db } from "../firebase";
import TransactionHistory from "./TransactionHistory";
import AllVehicles from "./AllVehicles";
import MyBookings from "./MyBookings";
import MyProfile from "./MyProfile";
import ProfileSidebar from "./ProfileSidebar";
import "./Dashboard.css"; 
import UserDashboard from "./UserDashboard";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const navigate = useNavigate();

  const userId = currentUser?.uid;

  useEffect(() => {
    const fetchWallet = async () => {
      if (!userId) return;
      try {
        const walletRef = doc(db, "wallets", userId);
        const walletSnap = await getDoc(walletRef);

        if (walletSnap.exists()) {
          const data = walletSnap.data();
          setWalletBalance(data.walletBalance || 0);
        } else {
          setWalletBalance(0);
        }
      } catch (err) {
        console.error("Error fetching wallet:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWallet();
  }, [userId]);

  if (!currentUser) return <p>Please log in to access the dashboard.</p>;
  if (loading) return <p>Loading your dashboard...</p>;

  const menu = [
    { name: "Home", icon: <FaHome />, tab: "home" },
    { name: "My Bookings", icon: <FaCar />, tab: "mybookings" },
    { name: "Book Vehicles", icon: <FaCarSide  />, path:"/all-vehicles" },
    { name: "My Transactions", icon: <FaWallet />, tab: "mytransactions" },
    { name: "My Profile", icon: <FaUser />, tab: "aboutme" },
  ];

  return (
    <div className="user-dashboard-container">
      <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          {!isCollapsed && <h2>User Panel</h2>}
          <button className="toggle-btn" onClick={() => setIsCollapsed(!isCollapsed)}>
            <FaBars />
          </button>
        </div>

        <div className="menu-list">
          {menu.map((item, idx) => (
            <div
              key={idx}
              className={`menu-item ${activeTab === item.tab ? "active" : ""}`}
              onClick={() =>{
                if (item.path) {
                  navigate(item.path);
                } else {
                  setActiveTab(item.tab);
                }
              }}
            >
              <span className="icon">{item.icon}</span>
              {!isCollapsed && <span className="label32">{item.name}</span>}
            </div>
          ))}
        </div>
      </aside>

      <main className="main-content">
        {activeTab === "home" && (
          <>
           <div style={{ position: "relative" }}> <ProfileSidebar /> </div>
            <div className="wallet-card">
              <h2>💼 Wallet Balance</h2>
              <p style={{color:"#05ff00"}}>₹{walletBalance.toFixed(2)}</p>
              <button style={{background:"white"}} onClick={() => navigate("/add-money")}>➕ Add Money</button>
            </div>
            <UserDashboard walletBalance={walletBalance.toFixed(2)}/>
          </>
        )}

        {activeTab === "mybookings" && (
          <>
            <MyBookings />
          </>
        )}

        {activeTab === "mytransactions" && (
          <>
            <TransactionHistory />
          </>
        )}

        {activeTab === "aboutme" && (
          <>
            <MyProfile />
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
