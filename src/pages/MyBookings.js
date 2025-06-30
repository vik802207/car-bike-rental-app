import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  addDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNotifications } from "../context/NotificationContext";
import RatingModal from "./RatingModal";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState(null);
  const [ratingsMap, setRatingsMap] = useState({});
  const [showRating, setShowRating] = useState(false);
  const [ratingBooking, setRatingBooking] = useState(null);
  const bookingsPerPage = 6;
  const { addNotification } = useNotifications();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const bookingsRef = query(
          collection(db, "bookings"),
          where("userId", "==", user.uid)
        );
        const cancelledRef = query(
          collection(db, "cancelBookings"),
          where("userId", "==", user.uid)
        );

        const [bookingsSnap, cancelledSnap, ratingsMap] = await Promise.all([
          getDocs(bookingsRef),
          getDocs(cancelledRef),
          getRatingsMap(),
        ]);
        setRatingsMap(ratingsMap);

        const bookingPromises = bookingsSnap.docs.map(async (docSnap) => {
          const booking = {
            id: docSnap.id,
            ...docSnap.data(),
            bookingId: docSnap.id,
          };
          try {
            const vehicleSnap = await getDoc(
              doc(db, "vehicles", booking.vehicleId)
            );
            booking.vehicleImage = vehicleSnap.exists()
              ? vehicleSnap.data().imageUrl
              : "";
          } catch {
            booking.vehicleImage = "";
          }
          const now = new Date();
          const end = new Date(`${booking.endDay}T${booking.endHour}`);
          booking.status = now < end ? "Active" : "Completed";
          return booking;
        });

        const cancelPromises = cancelledSnap.docs.map(async (docSnap) => {
          const b = docSnap.data();
          const cancelData = {
            id: docSnap.id,
            bookingId: b.bookingId || "",
            vehicleId: b.vehicleId,
            vehicleBrand: b.vehicleBrand || "Unknown",
            vehicleModel: b.vehicleModel || "",
            totalCost: b.totalCost || 0,
            startDay: b.startDay || "",
            startHour: b.startHour || "",
            endDay: b.endDay || "",
            endHour: b.endHour || "",
            cancelDate: b.cancelDate || "",
            status: "Cancelled",
          };
          try {
            const vehicleSnap = await getDoc(doc(db, "vehicles", b.vehicleId));
            cancelData.vehicleImage = vehicleSnap.exists()
              ? vehicleSnap.data().imageUrl
              : "";
          } catch {
            cancelData.vehicleImage = "";
          }
          return cancelData;
        });

        const all = await Promise.all([...bookingPromises, ...cancelPromises]);
        const sorted = all.sort(
          (a, b) =>
            new Date(`${b.startDay}T${b.startHour}`) -
            new Date(`${a.startDay}T${a.startHour}`)
        );

        setBookings(sorted);
        setFiltered(sorted);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const getRatingsMap = async () => {
    const ratingsSnap = await getDocs(collection(db, "ratings"));
    const ratingData = {};
    ratingsSnap.forEach((doc) => {
      const { vehicleId, rating } = doc.data();
      if (!ratingData[vehicleId]) {
        ratingData[vehicleId] = { sum: 0, count: 0 };
      }
      ratingData[vehicleId].sum += rating;
      ratingData[vehicleId].count += 1;
    });
    const avgMap = {};
    for (const [id, data] of Object.entries(ratingData)) {
      avgMap[id] = (data.sum / data.count).toFixed(1);
    }
    return avgMap;
  };

  const cancelBooking = async (booking) => {
    if (!booking || !booking.bookingId) return;
    setStatus("processing");
    try {
      const cancelData = {
        bookingId: booking.bookingId,
        vehicleId: booking.vehicleId,
        vehicleBrand: booking.vehicleBrand,
        vehicleModel: booking.vehicleModel,
        userId: booking.userId,
        totalCost: booking.totalCost,
        pricePerHour: booking.pricePerHour,
        startDay: booking.startDay,
        startHour: booking.startHour,
        endDay: booking.endDay,
        endHour: booking.endHour,
        createdAt: booking.createdAt || new Date(),
        cancelDate: Timestamp.now(),
      };
      await addDoc(collection(db, "cancelBookings"), cancelData);
      await deleteDoc(doc(db, "bookings", booking.bookingId));
      setStatus("success");
      addNotification("✅ Booking cancelled successfully.");
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      setStatus("error");
    } finally {
      setTimeout(() => setStatus(null), 3000);
    }
  };

  const handleRatingSubmit = async (rating) => {
    try {
      await addDoc(collection(db, "ratings"), {
        vehicleId: ratingBooking.vehicleId,
        rating,
        userId: auth.currentUser?.uid || "anonymous",
        createdAt: Timestamp.now(),
      });
      addNotification("⭐ Vehicle rated successfully!");
    } catch (error) {
      console.error("Rating failed", error);
    } finally {
      setShowRating(false);
      setRatingBooking(null);
    }
  };

  const applyFilter = (type) => {
    setFilter(type);
    const now = new Date();
    if (type === "upcoming") {
      setFiltered(
        bookings.filter((b) => new Date(`${b.startDay}T${b.startHour}`) > now)
      );
    } else if (type === "past") {
      setFiltered(
        bookings.filter(
          (b) =>
            new Date(`${b.endDay}T${b.endHour}`) < now &&
            b.status !== "Cancelled"
        )
      );
    } else if (type === "cancelled") {
      setFiltered(bookings.filter((b) => b.status === "Cancelled"));
    } else {
      setFiltered(bookings);
    }
    setCurrentPage(1);
  };

  const exportToExcel = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Brand,Model,From,To,Total Cost,Status\n";
    filtered.forEach((b) => {
      csvContent += `${b.vehicleBrand},${b.vehicleModel},${b.startDay} ${b.startHour},${b.endDay} ${b.endHour},₹${b.totalCost},${b.status}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "my_bookings.csv");
    document.body.appendChild(link);
    link.click();
  };

  const indexOfLast = currentPage * bookingsPerPage;
  const indexOfFirst = indexOfLast - bookingsPerPage;
  const currentBookings = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / bookingsPerPage);

  if (loading) return <p>Loading your bookings...</p>;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>📒 My Bookings</h2>

      <div style={{ marginBottom: "15px" }}>
        <button
          onClick={() => applyFilter("all")}
          style={btnStyle(filter === "all")}
        >
          All
        </button>
        <button
          onClick={() => applyFilter("upcoming")}
          style={btnStyle(filter === "upcoming")}
        >
          Upcoming
        </button>
        <button
          onClick={() => applyFilter("past")}
          style={btnStyle(filter === "past")}
        >
          Past
        </button>
        <button
          onClick={() => applyFilter("cancelled")}
          style={btnStyle(filter === "cancelled")}
        >
          Cancelled
        </button>
        <button onClick={exportToExcel} style={btnStyle(false)}>
          ⬇️ Export CSV
        </button>
      </div>

      {filtered.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "20px",
              marginTop: "20px",
            }}
          >
            {currentBookings.map((b) => (
              <div
                key={b.id}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "10px",
                  overflow: "hidden",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                  backgroundColor: "#fff",
                }}
              >
                {b.vehicleImage && (
                  <img
                    src={b.vehicleImage}
                    alt={b.vehicleModel}
                    style={{
                      width: "100%",
                      height: "180px",
                      objectFit: "cover",
                    }}
                  />
                )}
                <div
                  style={{
                    position: "relative",
                    marginBottom: "10px",
                    padding: "15px",
                  }}
                >
                  <h3 style={{ margin: "0 0 10px" }}>
                    {b.vehicleBrand} {b.vehicleModel}
                    {ratingsMap[b.vehicleId] && (
                      <span
                        style={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          fontSize: "0.9em",
                          color: "#f39c12",
                          background: "#fff",
                          padding: "2px 8px",
                          borderRadius: "0 0 0 6px",
                          boxShadow: "0 0 4px rgba(0,0,0,0.1)",
                        }}
                      >
                        ⭐ {ratingsMap[b.vehicleId]}
                      </span>
                    )}
                  </h3>

                  <p>
                    <strong>From:</strong> {b.startDay} {b.startHour}
                  </p>
                  <p>
                    <strong>To:</strong> {b.endDay} {b.endHour}
                  </p>
                  <p>
                    <strong>Cost:</strong> ₹{b.totalCost.toFixed(2)}
                  </p>
                  <p>
                    <strong>Status:</strong> {b.status}
                  </p>
                  <div
                    style={{
                      marginTop: "10px",
                      display: "flex",
                      gap: "10px",
                      flexWrap: "wrap",
                    }}
                  >
                    <button
                      disabled={b.status !== "Active"}
                      onClick={() =>
                        b.status === "Active" &&
                        window.confirm(
                          "Are you sure you want to cancel this booking?"
                        ) &&
                        cancelBooking(b)
                      }
                      style={{
                        padding: "6px 10px",
                        backgroundColor:
                          b.status === "Active" ? "#dc3545" : "#ccc",
                        color: "white",
                        border: "none",
                        borderRadius: 4,
                        cursor:
                          b.status === "Active" ? "pointer" : "not-allowed",
                      }}
                    >
                      Cancel Booking
                    </button>

                    <button
                      disabled={b.status !== "Completed"}
                      onClick={() => {
                        setRatingBooking(b);
                        setShowRating(true);
                      }}
                      style={{
                        padding: "6px 10px",
                        backgroundColor:
                          b.status === "Completed" ? "#5EBF7D" : "#ccc",
                        color: "#333",
                        border: "none",
                        borderRadius: 4,
                        cursor:
                          b.status === "Completed" ? "pointer" : "not-allowed",
                      }}
                    >
                      ⭐ Rate Vehicle
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              style={pageBtn}
            >
              ◀ Prev
            </button>
            <span style={{ margin: "0 10px" }}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              style={pageBtn}
            >
              Next ▶
            </button>
          </div>
        </>
      )}

      <RatingModal
        isOpen={showRating}
        onClose={() => setShowRating(false)}
        onSubmit={handleRatingSubmit}
        vehicleName={`${ratingBooking?.vehicleBrand} ${ratingBooking?.vehicleModel}`}
      />
    </div>
  );
}

const btnStyle = (active) => ({
  marginRight: 8,
  padding: "6px 12px",
  backgroundColor: active ? "#007bff" : "#eee",
  color: active ? "white" : "#333",
  border: "none",
  borderRadius: 4,
  cursor: "pointer",
});

const pageBtn = {
  padding: "6px 12px",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  borderRadius: 4,
  cursor: "pointer",
};

export default MyBookings;
