const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
  name: String,
  type: String, // car or bike
  imageUrl: String,
  pricePerDay: Number,
  description: String,
  location: String,  // <-- Add location field here
});
module.exports = mongoose.model("Vehicle", vehicleSchema);
