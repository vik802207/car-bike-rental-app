import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc
} from "firebase/firestore";
import { auth, db } from "../firebase";
import "./MyVehicleBookings.css";

const MyVehicleBookings = () => {
  const [myBookings, setMyBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("none");
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 10;
  const user = auth.currentUser;

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;

      const vehicleQuery = query(
        collection(db, "vehicles"),
        where("ownerId", "==", user.uid)
      );
      const vehicleSnap = await getDocs(vehicleQuery);
      const vehicleMap = {};
      vehicleSnap.forEach((doc) => {
        vehicleMap[doc.id] = doc.data().imageUrl || "";
      });

      const vehicleIds = Object.keys(vehicleMap);
      if (vehicleIds.length === 0) {
        setMyBookings([]);
        return;
      }

      const bookingSnap = await getDocs(collection(db, "bookings"));
      const allBookings = bookingSnap.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((booking) => vehicleIds.includes(booking.vehicleId))
        .map((booking) => ({
          ...booking,
          vehicleImage: vehicleMap[booking.vehicleId] || "",
        }));
        const total = allBookings.reduce((acc, b) => acc + b.totalCost, 0);
localStorage.setItem("totalEarnings", total.toFixed(2));
  const adminProfileRef = doc(db, "adminProfiles", user.uid);
    try {
      await updateDoc(adminProfileRef, {
        totalEarnings: total.toFixed(2),
      });
    } catch (err) {
      console.error("Error updating total earnings in adminProfiles:", err);
    }

      setMyBookings(allBookings);
      setFilteredBookings(allBookings);
    };

    fetchBookings();
  }, [user]);

  useEffect(() => {
    let filtered = [...myBookings];
    if (searchTerm) {
      filtered = filtered.filter((booking) =>
        booking.vehicleId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortBy === "date") {
      filtered.sort((a, b) => new Date(a.startDay) - new Date(b.startDay));
    } else if (sortBy === "cost") {
      filtered.sort((a, b) => b.totalCost - a.totalCost);
    }
    

    setFilteredBookings(filtered);
    setCurrentPage(1);
  }, [searchTerm, sortBy, myBookings]);

  const indexOfLast = currentPage * bookingsPerPage;
  const indexOfFirst = indexOfLast - bookingsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);

  return (
    <div className="booking-wrapper">
      <div className="booking-controls">
        <input
          type="text"
          placeholder="🔍 Search by Vehicle ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select onChange={(e) => setSortBy(e.target.value)} value={sortBy}>
          <option value="none">Sort</option>
          <option value="date">📅 Date</option>
          <option value="cost">💰 Cost</option>
        </select>
      </div>

      <div className="booking-table">
        <ul className="booking-header">
          <li>Vehicle</li>
          <li>User ID</li>
          <li>From</li>
          <li>To</li>
          <li>Total Cost</li>
        </ul>

        {currentBookings.map((booking, idx) => (
          <ul key={idx} className="booking-row">
            <li className="vehicle-cell">
              <img
                src={booking.vehicleImage || "https://i.ibb.co/7NzhcJYQ/6.png"}
                alt="Vehicle"
                className="vehicle-img"
              />
              <span className="vehicle-id">{booking.vehicleId}</span>
            </li>
            <li>{booking.userId}</li>
            <li>{booking.startDay}, {booking.startHour}</li>
            <li>{booking.endDay}, {booking.endHour}</li>
            <li className="cost">+ ₹{booking.totalCost.toFixed(2)}</li>
          </ul>
        ))}
      </div>

      <div className="pagination">
        <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>
          ◀ Prev
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next ▶
        </button>
      </div>
    </div>
  );
};

export default MyVehicleBookings;
