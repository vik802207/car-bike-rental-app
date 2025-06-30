// models/WalletTransaction.js
const mongoose = require("mongoose");

const walletTransactionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  amount: { type: Number, required: true },
  paymentId: { type: String, required: true },
  type: { type: String, enum: ["credit", "debit"], required: true },
  status: { type: String, enum: ["success", "failed"], required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("WalletTransaction", walletTransactionSchema);
