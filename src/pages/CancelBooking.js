import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { collection, addDoc, Timestamp, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

function CancelBooking() {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState("processing");
  const booking = location.state?.booking;

  useEffect(() => {
    if (!booking || !booking.bookingId) {
      setStatus("error");
      return;
    }

    let hasCancelled = false; // function-scoped flag

    const cancelAndDeleteBooking = async () => {
      if (hasCancelled) return; // safeguard if re-triggered
      hasCancelled = true;

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
        alert("Money will be deposited to wallet after 4-5 business days");
        setTimeout(() => navigate("/dashboard"), 1000);
      } catch (err) {
        setStatus("error");
      }
    };

    cancelAndDeleteBooking();

    // clean up just in case (not strictly needed here)
    return () => {
      hasCancelled = true;
    };
  }, [booking, navigate]);

  return (
    <div style={{ padding: 30 }}>
      {status === "processing" && <p>⏳ Cancelling your booking...</p>}
      {status === "success" && <p>✅ Booking cancelled successfully! Redirecting...</p>}
      {status === "error" && <p>❌ Failed to cancel booking.</p>}
    </div>
  );
}

export default CancelBooking;
