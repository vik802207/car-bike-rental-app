import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";
import "./AdminWalletTransactions.css";

const AdminWalletTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!userId) return;

      try {
        const q = query(
          collection(db, "adminWalletTransactions"),
          where("adminId", "==", userId)
        );
        const snap = await getDocs(q);
        const results = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTransactions(results);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      }
    };

    fetchTransactions();
  }, [userId]);

  return (
    <div className="transaction-container">
      <h2>📋 Wallet Transactions</h2>
      {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Txn ID</th>
              <th>To Bank</th>
              <th>Account No</th>
              <th>Holder</th>
              <th>Amount (₹)</th>
              <th>Date & Time</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => (
              <tr key={txn.id}>
                <td>{txn.id}</td>
                <td>{txn.bankName}</td>
                <td>****{txn.accountNumber?.slice(-4)}</td>
                <td>{txn.holderName}</td>
                <td className="amount">- ₹{txn.amount.toFixed(2)}</td>
                <td>{new Date(txn.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminWalletTransactions;
