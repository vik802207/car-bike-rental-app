// routes/walletTransaction.js
const express = require("express");
const router = express.Router();
const WalletTransaction = require("../models/Wallet")

router.post("/transaction", async (req, res) => {
  const { userId, amount, paymentId, type, status } = req.body;

  try {
    const transaction = new WalletTransaction({
      userId,
      amount,
      paymentId,
      type,
      status,
      timestamp: new Date(),
    });

    await transaction.save();
    res.json({ success: true });
  } catch (err) {
    console.error("MongoDB save error:", err);
    res.status(500).json({ error: "MongoDB transaction save failed" });
  }
});

module.exports = router;
