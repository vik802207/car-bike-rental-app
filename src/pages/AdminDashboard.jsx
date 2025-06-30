import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaWallet,
  FaCar,
  FaPlus,
  FaBars,
  FaListAlt,
  FaCarSide ,
  FaFileInvoiceDollar 
} from "react-icons/fa";
import AdminMyVehicles from "./AdminMyVehicles";
import "./AdminDashboard.css";
import AdminHome from "../admin/AdminHome";
import BankAccountInfo from "../admin/BankAccountInfo";
import MyVehicleBookings from "../admin/MyVehicleBookings";
import AdminWalletTransactions from "../admin/AdminWalletTransactions";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const menu = [
    { name: "Home", icon: <FaHome />, tab: "home" },
    { name: "Wallet Transactions", icon: <FaWallet />, tab: "wallet" },
    { name: "Billing", icon: <FaFileInvoiceDollar   />, tab:"billing" },
    { name: "All Bookings", icon: <FaListAlt />, tab: "bookings" },
    { name: "All Added Vehicles", icon: <FaCar />, tab: "vehicles" },
    { name: "Add Vehicle", icon: <FaPlus  />, path: "/add-vehicle" }

  ];

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          {!isCollapsed && <h2 className="sidebar-title">Admin Panel</h2>}
          <button className="toggle-btn" onClick={() => setIsCollapsed(!isCollapsed)}>
            <FaBars />
          </button>
        </div>

        <div className="menu-list">
          {menu.map((item, i) => (
            <div
              key={i}
              onClick={() => {
                if (item.path) {
                  navigate(item.path);
                } else {
                  setActiveTab(item.tab);
                }
              }}
              className={`menu-item ${
                activeTab === item.tab ? "active" : ""
              }`}
            >
              <span className="icon">{item.icon}</span>
              {!isCollapsed && <span className="label" style={{color:"black"}}>{item.name}</span>}
            </div>
          ))}
        </div>

        {/* Optional Add Vehicle Button (can be removed if menu includes it) */}
        {/* <button
          onClick={() => navigate("/add-vehicle")}
          className={`add-btn ${isCollapsed ? "collapsed" : ""}`}
        >
          <FaPlus />
          {!isCollapsed && <span>Add Vehicle</span>}
        </button> */}
      </aside>

      <main className="main-content">
        {activeTab === "home" && <AdminHome/>}
        {activeTab === "wallet" && <AdminWalletTransactions />}
        {activeTab === "billing" && <BankAccountInfo cardType="mastercard"
  holderName="Jack Peterson"
  cardNumber="4562 1122 4594 7852"
  expiry="11/22"/>}
        {activeTab === "bookings" && <MyVehicleBookings/>}
        {activeTab === "vehicles" && <AdminMyVehicles />}
      </main>
    </div>
  );
};



export default AdminDashboard;
