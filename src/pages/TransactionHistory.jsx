import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { db } from "../firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "./TransactionHistory.css";

const TransactionHistory = () => {
  const [firebaseTransactions, setFirebaseTransactions] = useState([]);
  const [mongoTransactions, setMongoTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const user = getAuth().currentUser;

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      let firebaseData = [];
      let bookingData = [];

      try {
        const walletQuery = query(
          collection(db, "wallets"),
          where("userId", "==", user.uid),
          orderBy("timestamp", "desc")
        );
        const walletSnapshot = await getDocs(walletQuery);
        firebaseData = walletSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          source: "Firebase",
        }));
      } catch (err) {
        console.error("Firebase wallet error:", err);
      }

      try {
        const bookingQuery = query(
          collection(db, "bookings"),
          where("userId", "==", user.uid)
        );
        const bookingSnapshot = await getDocs(bookingQuery);
        bookingData = bookingSnapshot.docs.map((doc) => {
          const createdAt = doc.data().createdAt || new Date();
          const formattedTimestamp = new Date(createdAt).toLocaleString(
            "en-US"
          );
          return {
            id: doc.id,
            amount: doc.data().totalCost,
            timestamp: formattedTimestamp,
            type: "booking",
            status: "success",
            source: "Firebase",
          };
        });
      } catch (err) {
        console.error("Firebase bookings error:", err);
      }

      try {
        const res = await fetch(
          `http://localhost:8000/api/all/transactions/${user.uid}`
        );
        const mongoData = await res.json();
        setMongoTransactions(
          mongoData.map((item) => ({
            ...item,
            source: "MongoDB",
          }))
        );
      } catch (err) {
        console.error("MongoDB error:", err);
      }

      setFirebaseTransactions([...firebaseData, ...bookingData]);
      setLoading(false);
    };

    if (user?.uid) fetchTransactions();
  }, [user]);

  const filtered = [...firebaseTransactions, ...mongoTransactions]
    .sort(
      (a, b) =>
        new Date(b.timestamp || b.createdAt) -
        new Date(a.timestamp || a.createdAt)
    )
    .filter((tx) => {
      const typeMatch =
        typeFilter === "all" || (tx.type || "credit") === typeFilter;
      const dateMatch =
        !dateFilter ||
        new Date(tx.timestamp || tx.createdAt).toDateString() ===
          new Date(dateFilter).toDateString();
      return typeMatch && dateMatch;
    });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const exportExcel = () => {
    const exportData = filtered.map((tx) => ({
      Amount: tx.amount,
      Type: tx.type || "credit",
      Status: tx.status || "success",
      Date: new Date(tx.timestamp || tx.createdAt).toLocaleString(),
      Source: tx.source,
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transactions");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "transaction_history.xlsx");
  };

  return (
    <div className="transaction-container">
      <h2 className="transaction-heading">💳 Transaction History</h2>

      <div className="transaction-controls">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="credit">Credit</option>
          <option value="debit">Debit</option>
        </select>

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />

        <button onClick={exportExcel} className="export-btn">
          Export Excel
        </button>
        <button onClick={() => window.print()} className="print-btn">
          Print
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : filtered.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <>
          <table className="transaction-table">
            <thead>
              <tr>
                <th>Amount</th>
                <th>Type</th>
                <th>Status</th>
                <th>Date</th>
                <th>Payment Id</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((tx, i) => (
                <tr key={i}>
                  <td
                    style={{
                      color: tx.type === "booking" ? "red" : "green",
                      fontWeight: "bold",
                    }}
                  >
                    {tx.type === "booking"
                      ? `- ₹${tx.amount.toFixed(2)}`
                      : `+ ₹${tx.amount.toFixed(2)}`}
                  </td>
                  <td>{tx.type || "credit"}</td>
                  <td>{tx.status || "success"}</td>
                  <td>
                    {new Date(tx.timestamp || tx.createdAt).toLocaleString()}
                  </td>
                  <td>{tx.type === "credit" ? tx.paymentId : tx.id}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination-controls">
            <div>
              <label>Page Size: </label>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
              >
                {[5, 10, 20, 50].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              >
                Prev
              </button>
              <span style={{ margin: "0 10px" }}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TransactionHistory;
