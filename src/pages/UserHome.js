import React from "react";
import "./UserHome.css";
import { FaMoneyBill, FaChartLine, FaUsers, FaTable } from "react-icons/fa";

const mockReservations = [
  { name: "Michelle Rivera", time: "17:40", table: "K-1", people: 4 },
  { name: "Arlene McCoy", time: "17:40", table: "T-3", people: 5 },
  { name: "Savannah Nguyen", time: "17:40", table: "K-1", people: 3 },
];

const UserHome = () => {
  return (
    <div className="dashboard-container">
      {/* Top Cards */}
      <div className="card-grid">
        {[
          {
            title: "Total Revenue",
            value: "$12,896",
            change: "+3.67%",
            icon: <FaMoneyBill className="icon green" />,
          },
          {
            title: "Total Expense",
            value: "$6,886",
            change: "-2.67%",
            icon: <FaChartLine className="icon red" />,
          },
          {
            title: "Total Reservations",
            value: "1874",
            change: "+2.54%",
            icon: <FaUsers className="icon green" />,
          },
          {
            title: "Occupied Table / h",
            value: "75%",
            change: "-2.57%",
            icon: <FaTable className="icon red" />,
          },
        ].map((card, idx) => (
          <div key={idx} className="card">
            <div className="card-header">
              <h4>{card.title}</h4>
              {card.icon}
            </div>
            <div className="card-value">{card.value}</div>
            <div className={`card-change ${card.change.startsWith("+") ? "green" : "red"}`}>
              {card.change}
            </div>
          </div>
        ))}
      </div>

      <div className="main-grid">
        {/* Left Column */}
        <div className="left-col">
          <div className="reservations-box">
            <div className="box-header">
              <h3>Current Reservations</h3>
              <button className="view-all">View All</button>
            </div>
            {mockReservations.map((r, i) => (
              <div key={i} className="reservation-row">
                <div className="avatar" />
                <div className="name">{r.name}</div>
                <div>{r.time}</div>
                <div>{r.table}</div>
                <div>{r.people} People</div>
                <div className="confirmed">Confirmed</div>
                <button className="edit-btn">Edit</button>
              </div>
            ))}
          </div>

          <div className="chart-placeholder">📊 Bar Chart Here</div>
        </div>

        {/* Right Column */}
        <div className="right-col">
          <div className="chart-placeholder">📈 Line Chart Here</div>

          <div className="popular-box">
            <h3>Most Popular Menu Items</h3>
            <div className="menu-row">
              <span>🥗 Grilled Salmon</span>
              <span>$68 • 4500$</span>
            </div>
            <div className="menu-row">
              <span>🍜 Pad Thai</span>
              <span>$76 • 4500$</span>
            </div>
            <div className="menu-row">
              <span>🦞 Lobster Bisque</span>
              <span>$55 • 4500$</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHome;
