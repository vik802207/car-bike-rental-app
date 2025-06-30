import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  doc,
  getDoc,
  updateDoc,
  addDoc, collection
} from "firebase/firestore";
import "./WithdrawAccounts.css"; // Your custom styles

const WithdrawAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [showModal, setShowModal] = useState(false);
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    const fetchCards = async () => {
      const ref = doc(db, "adminProfiles", userId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setAccounts(snap.data().accountCards || []);
      }
    };
    if (userId) fetchCards();
  }, [userId]);

  const openWithdrawModal = (index) => {
    setSelectedIndex(index);
    setWithdrawAmount("");
    setShowModal(true);
  };

  const handleWithdraw = async () => {
  if (!withdrawAmount || isNaN(withdrawAmount)) return alert("Enter a valid amount");

  const ref = doc(db, "adminProfiles", userId);
  try {
    const snap = await getDoc(ref);
    if (!snap.exists()) return alert("Admin profile not found");

    const data = snap.data();
    const currentWallet = parseFloat(data.walletBalance || 0);
    const withdraw = parseFloat(withdrawAmount);

    if (withdraw > currentWallet) {
      return alert("Insufficient wallet balance");
    }

    const updatedAccounts = [...accounts];
    const selectedAccount = updatedAccounts[selectedIndex];
    const prevBalance = parseFloat(updatedAccounts[selectedIndex].accountBalance || 0);
    updatedAccounts[selectedIndex].accountBalance = prevBalance + withdraw;

    await updateDoc(ref, {
      accountCards: updatedAccounts,
      walletBalance: currentWallet - withdraw,
    });
    await addDoc(collection(db, "adminWalletTransactions"), {
      adminId: userId,
      bankName: selectedAccount.bankName,
      accountNumber: selectedAccount.accountNumber,
      holderName: selectedAccount.holderName,
      ifscCode: selectedAccount.ifscCode,
      transactionType: "Withdraw",
      amount: withdraw,
      timestamp: new Date().toISOString(),
    });

    setAccounts(updatedAccounts);
    setShowModal(false);
    alert("Money withdrawn successfully");
  } catch (err) {
    console.error("Withdraw error:", err);
    alert("Failed to withdraw money");
  }
};
  return (
    <div className="withdraw-accounts-container">
      <h2>💳 Linked Bank Accounts</h2>

      <ul className="card-list">
        {accounts.map((acc, index) => (
          <li key={index} className="card-item">
            <div className="card-header">
              <strong>{acc.bankName}</strong> - ****{acc.accountNumber?.slice(-4)}
            </div>
            <div className="card-body">
              <p>👤 Holder: {acc.holderName}</p>
              <p>💰 Balance: ₹{acc.accountBalance?.toFixed(2) || "0.00"}</p>
              <button className="glow-btn" onClick={() => openWithdrawModal(index)}>
                Withdraw
              </button>
            </div>
          </li>
        ))}
      </ul>

      {showModal && (
  <div className="modal-overlay34">
    <div className="modal34">
      <h3>Enter Withdrawal Amount</h3>
      <input
        type="number"
        placeholder="₹ Enter amount"
        value={withdrawAmount}
        onChange={(e) => setWithdrawAmount(e.target.value)}
      />
      <div className="modal-actions34">
        <button className="confirm-btn" onClick={handleWithdraw}>Confirm</button>
        <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default WithdrawAccounts;