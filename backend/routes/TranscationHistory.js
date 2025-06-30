// Express route
const express = require("express");
const router = express.Router();
const WalletTransaction = require("../models/Wallet")

router.get("/transactions/:uid", async (req, res) => {
  try {
    const data = await WalletTransaction.find({ userId: req.params.uid }).sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

module.exports = router;
