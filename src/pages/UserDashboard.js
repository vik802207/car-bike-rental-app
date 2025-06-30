import React from "react";
import "./UserDashboard.css";
import { FaTags, FaWallet, FaUsers, FaClock,FaPen  } from "react-icons/fa";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";
const UserDashboard = () => {
    const data = [
  { day: "Mon", value: 45 },
  { day: "Tue", value: 60 },
  { day: "Wed", value: 70.68 },
  { day: "Thu", value: 40 },
  { day: "Fri", value: 135 },
  { day: "Sat", value: 125 },
  { day: "Sun", value: 60 },
];
    const reservations = [
  {
    name: "Michelle Rivera",
    time: "17:40",
    table: "K-1",
    people: "4 People",
    status: "Confirmed",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Arlene McCoy",
    time: "17:40",
    table: "T-3",
    people: "5 People",
    status: "Confirmed",
    img: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    name: "Savannah Nguyen",
    time: "17:40",
    table: "K-1",
    people: "3 People",
    status: "Confirmed",
    img: "https://randomuser.me/api/portraits/women/19.jpg",
  },
];
  const StatCard = ({ title, value, change, icon, isPositive }) => {
    return (
      <div className="stat-card">
        <div className="stat-card-header">
          <span className="stat-title">{title}</span>
          <div className="stat-icon">{icon}</div>
        </div>
        <div className="stat-value">{value}</div>
        <div className={`stat-change ${isPositive ? "positive" : "negative"}`}>
          {change}
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <div className="dashboard-actions">
          <input type="text" placeholder="Search..." />
          <span>Monday, July 2</span>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Total Revenue"
          value="$12,896"
          change="+3.67%"
          icon={<FaTags />}
          isPositive
        />
        <StatCard
          title="Total Expense"
          value="$6,886"
          change="-2.67%"
          icon={<FaWallet />}
        />
        <StatCard
          title="Total Reservations"
          value="1874"
          change="+2.54%"
          icon={<FaUsers />}
          isPositive
        />
        <StatCard
          title="Occupied Table / h"
          value="75 %"
          change="-2.57%"
          icon={<FaClock />}
        />
      </div>
      <div className="joink">
      <div className="reservation-card">
  <div className="reservation-header">
    <h3>Current Reservations</h3>
    <a href="#">View All</a>
  </div>
  {reservations.map((res, index) => (
    <div key={index} className="reservation-row">
      <img src={res.img} alt={res.name} className="profile-img" />
      <span className="res-name">{res.name}</span>
      <span className="res-time">{res.time}</span>
      <span className="res-table">{res.table}</span>
      <span className="res-people">{res.people}</span>
      <span className="res-status">{res.status}</span>
      <FaPen className="edit-icon" />
    </div>
  ))}
</div>
 <div className="chart-card">
      <div className="chart-header">
        <h3>Average Check Size (USD)</h3>
        <div className="toggle-buttons">
          <button className="active">Weekly</button>
          <button disabled>Monthly</button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7e57c2" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#7e57c2" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip
            contentStyle={{
              background: "#fff",
              borderRadius: "10px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              fontSize: "14px",
            }}
            formatter={(value) => [`$${value.toFixed(2)}`, ""]}
            labelFormatter={(label) => `22 February`} // optional static date
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#7e57c2"
            fillOpacity={1}
            fill="url(#gradient)"
            strokeWidth={3}
            dot={{ stroke: "#7e57c2", strokeWidth: 2, r: 4, fill: "#fff" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
    </div>
    </div>
  );
};

export default UserDashboard;
