// server.js or routes/booking.js (Node.js + Express)
const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking"); // Your MongoDB Mongoose model

router.post("/bookings", async (req, res) => {
  try {
    const bookingData = req.body;

    // Validate data here if needed

    const newBooking = new Booking(bookingData);
    await newBooking.save();

    res.status(201).json({ message: "Booking saved successfully", booking: newBooking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save booking" });
  }
});

module.exports = router;
