import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, collection, addDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import PaymentModal from "./PaymentModal";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { useNotifications } from "../context/NotificationContext";
function BookingSystem() {
  const { vehicleId } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [availability, setAvailability] = useState(null);
  const [totalCost, setTotalCost] = useState(0);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [email,setEmail]=useState('');
  const navigate=useNavigate();
  const { addNotification } = useNotifications();
  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      setEmail(user.email);
      console.log("✅ Logged in as:", user.email);
    } else {
      console.log("❌ Not logged in");
    }
  });

  return () => unsubscribe();
}, []);
  useEffect(() => {
    async function fetchVehicle() {
      setLoading(true);
      const docRef = doc(db, "vehicles", vehicleId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setVehicle({
          id: docSnap.id,
          ...data,
          startDate: new Date(data.startDate),
          endDate: new Date(data.endDate),
        });
      } else {
        setVehicle(null);
      }
      setLoading(false);
    }

    fetchVehicle();
  }, [vehicleId]);

  useEffect(() => {
    if (!startDate || !endDate || !vehicle) {
      setAvailability(null);
      setTotalCost(0);
      return;
    }

    const userStart = new Date(startDate);
    const userEnd = new Date(endDate);

    if (userStart >= userEnd) {
      setAvailability(false);
      setTotalCost(0);
      return;
    }

    const isAvailable =
      userStart >= vehicle.startDate && userEnd <= vehicle.endDate;

    setAvailability(isAvailable);

    if (isAvailable) {
      const diffMs = userEnd - userStart;
      const diffHours = diffMs / (1000 * 60 * 60);
      setTotalCost(diffHours * vehicle.pricePerDay);
    } else {
      setTotalCost(0);
    }
  }, [startDate, endDate, vehicle]);

  const onPaymentSuccess = async () => {
    if (!auth.currentUser) {
      alert("User not logged in!");
      return;
    }

    const userId = auth.currentUser.uid;
    const walletRef = doc(db, "wallets", userId);

    try {
      const walletSnap = await getDoc(walletRef);

      if (!walletSnap.exists()) {
        alert("Wallet not found!");
        return;
      }

      const currentBalance = walletSnap.data().walletBalance;
      console.log(currentBalance);
      if (currentBalance < totalCost) {
        alert("❌ Insufficient balance in wallet!");
        return;
      }

      // Deduct from wallet
      await updateDoc(walletRef, {
        walletBalance: currentBalance - totalCost,
      });

      const start = new Date(startDate);
      const end = new Date(endDate);

      const bookingData = {
        vehicleId: vehicle.id,
        vehicleBrand: vehicle.brand,
        vehicleModel: vehicle.model,
        startDay: start.toISOString().split("T")[0],
        startHour: start.toISOString().split("T")[1].slice(0, 5),
        endDay: end.toISOString().split("T")[0],
        endHour: end.toISOString().split("T")[1].slice(0, 5),
        totalCost,
        pricePerHour: vehicle.pricePerDay,
        createdAt: new Date().toISOString(),
        userId,
      };

     const docRef= await addDoc(collection(db, "bookings"), bookingData);
     console.log(docRef.id)
      await updateDoc(docRef, { bookingId: docRef.id });
       const bookingDataNew = {
        vehicleId: vehicle.id,
        vehicleBrand: vehicle.brand,
        vehicleModel: vehicle.model,
        startDay: start.toISOString().split("T")[0],
        startHour: start.toISOString().split("T")[1].slice(0, 5),
        endDay: end.toISOString().split("T")[0],
        endHour: end.toISOString().split("T")[1].slice(0, 5),
        totalCost,
        pricePerHour: vehicle.pricePerDay,
        BookingId:docRef.id,
        createdAt: new Date().toISOString(),
        userId,
      };

      const response = await fetch("https://car-bike-rental-app.onrender.com/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingDataNew),
      });



const formData = new URLSearchParams({
      vehicleId: vehicle.id,
        vehicleBrand: vehicle.brand,
        vehicleModel: vehicle.model,
        startDay: start.toISOString().split("T")[0],
        startHour: start.toISOString().split("T")[1].slice(0, 5),
        endDay: end.toISOString().split("T")[0],
        endHour: end.toISOString().split("T")[1].slice(0, 5),
        totalCost,
        pricePerHour: vehicle.pricePerDay,
        createdAt: new Date().toISOString(),
        userId, 
        email:email,
});



  if (!response.ok) throw new Error("Failed to save in MongoDB");

      alert("✅ Booking confirmed & wallet debited!");
      addNotification("🎉 Vehicle booked successfully!");
      navigate("/dashboard");
      setShowPaymentModal(false);

await fetch("https://script.google.com/macros/s/AKfycbz8vYGmNd0oBPEJK3_t0mykmNdFfnuJBFzi5k_V_Cy7qq6FeGTdEBy_Sy818x2Y3a5DIA/exec", {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded"
  },
  body: formData.toString()
});
  const generateCoupon = async (userId) => {
  const cashbackAmount = Math.floor(Math.random() * 50) + 10; // ₹10–₹59 random cashback
  await addDoc(collection(db, "coupons"), {
    userId,
    amount: cashbackAmount,
    isClaimed: false,
    createdAt: new Date().toISOString(),
  });
};
await generateCoupon(auth.currentUser.uid);


    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
    } finally {
      setBookingInProgress(false);
    }
  };

  if (loading) return <p>Loading vehicle data...</p>;
  if (!vehicle) return <p>Vehicle not found.</p>;

  return (
    <div style={{ maxWidth: 500, margin: "20px auto", fontFamily: "Arial, sans-serif" }}>
      <h2>Booking for {vehicle.brand} {vehicle.model}</h2>
      <img
        src={vehicle.imageUrl}
        alt={vehicle.model}
        style={{
          width: "100%",
          height: 200,
          objectFit: "cover",
          borderRadius: 8,
          marginBottom: 16,
        }}
      />

      <label>
        Start Date & Time:
        <input
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={{ display: "block", margin: "8px 0 16px" }}
        />
      </label>

      <label>
        End Date & Time:
        <input
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          style={{ display: "block", margin: "8px 0 16px" }}
        />
      </label>

      {availability === null ? (
        <p>Please select start and end date/time.</p>
      ) : availability ? (
        <>
          <p style={{ color: "green" }}>✅ Vehicle is available!</p>
          <p>
            Total Cost: <strong>₹{totalCost.toFixed(2)}</strong> ({vehicle.pricePerDay} ₹/day)
          </p>
          <button
            onClick={() => setShowPaymentModal(true)}
            disabled={bookingInProgress}
            style={{
              padding: "8px 16px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            {bookingInProgress ? "Processing..." : "Confirm Payment"}
          </button>
        </>
      ) : (
        <p style={{ color: "red" }}>❌ Vehicle not available for selected dates.</p>
      )}

      {showPaymentModal && (
        <PaymentModal
          totalCost={totalCost}
          onClose={() => setShowPaymentModal(false)}
          onPaymentSuccess={onPaymentSuccess}
        />
      )}
    </div>
  );
}

export default BookingSystem;
