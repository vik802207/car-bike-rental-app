
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const connectDB = require('./config/db');
const Booking=require("./routes/Booking");
const walletRoutes =require("./routes/wallet")
const WalletHistory=require("./routes/TranscationHistory")
const app = express();

app.use(express.json());
app.use(cors());

connectDB();
app.get('/', (req, res) => {
  res.send('Backend is running');
});
app.use("/api",Booking);
app.use("/api/wallet",walletRoutes);
app.use("/api/all",WalletHistory);
// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
