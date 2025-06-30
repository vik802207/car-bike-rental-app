const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  vehicleId: {
    type: String,
    required: true,
  },
  vehicleBrand: {
    type: String,
    required: true,
  },
  vehicleModel: {
    type: String,
    required: true,
  },
  startDay: {
    type: String, 
    required: true,
  },
  startHour: {
    type: String, 
    required: true,
  },
  endDay: {
    type: String, 
    required: true,
  },
  endHour: {
    type: String, 
    required: true,
  },
  totalCost: {
    type: Number,
    required: true,
  },
  pricePerHour: {
    type: Number,
    required: true,
  },
  BookingId:{
    type:String,
    require:true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  userId:{
    type:String,
    require:true,
  }
});

module.exports = mongoose.model("Booking", bookingSchema);
