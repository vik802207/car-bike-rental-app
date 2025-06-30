const express = require("express");
const router = express.Router();
const Vehicle = require("../models/Vehicle");

// Create a vehicle
router.post("/", async (req, res) => {
  try {
    const { name, type, imageUrl, pricePerDay, description } = req.body;
    const vehicle = new Vehicle({ name, type, imageUrl, pricePerDay, description });
    await vehicle.save();
    res.status(201).send(vehicle);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

// Get all vehicles
router.get("/", async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.status(200).send(vehicles);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

module.exports = router;
