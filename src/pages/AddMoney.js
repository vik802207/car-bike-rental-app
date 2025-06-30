import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { useNotifications } from "../context/NotificationContext";
const AddMoney = () => {
  const [amount, setAmount] = useState("");
  const [mobile, setMobile] = useState("");
  const [triggerPayment, setTriggerPayment] = useState(false);
  const navigate = useNavigate();
  const user = getAuth().currentUser;
  const userId = user?.uid;
  const {addNotification}=useNotifications();
  const updateWallet = async (newAmount, paymentId, status) => {
    if (!userId) return;

    try {
      // If payment was successful, update wallet balance
      if (status === "success") {
        const walletRef = doc(db, "wallets", userId);
        const walletSnap = await getDoc(walletRef);
        const currentBalance = walletSnap.exists()
          ? walletSnap.data().walletBalance || 0
          : 0;

        const updatedBalance = currentBalance + newAmount;

        await setDoc(walletRef, {
          userId,
          walletBalance: updatedBalance,
          updatedAt: new Date().toISOString(),
        });
      }

      // Log transaction in Firestore
      await addDoc(collection(db, "walletTransactions"), {
        userId,
        amount: newAmount,
        paymentId,
        type: "credit",
        status,
        timestamp: serverTimestamp(),
      });

      // Log transaction in external backend
      await fetch("http://localhost:8000/api/wallet/transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          amount: newAmount,
          paymentId,
          type: "credit",
          status,
          timestamp: new Date().toISOString(),
        }),
      });

      if (status === "success") {
        alert(`₹${newAmount} has been added to your wallet successfully!`);
         addNotification(`💰 ₹${newAmount} Wallet payment successful!`);
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Wallet update error:", err);
      alert("Something went wrong");
    }
  };

  const startRazorpay = () => {
    const options = {
      key: "rzp_test_ZOt9n5CnF4YG2Z", 
      amount: Number(amount) * 100,
      currency: "INR",
      name: "Car Bike Rental Wallet",
      description: "Add Funds to Wallet",
      image: "https://cdn-icons-png.flaticon.com/512/168/168882.png",
      handler: function (response) {
        // Payment success
        console.log("Payment success:", response);
        updateWallet(Number(amount), response.razorpay_payment_id, "success");
      },
      prefill: {
        name: user?.displayName || "User",
        email: user?.email || "user@example.com",
        contact: mobile || "",
      },
      notes: {
        business_name: "Car & Bike Rental Pvt. Ltd.",
        support: "support@rentalwallet.com",
      },
      theme: {
        color: "#3B82F6",
        backdrop_color: "#F3F4F6",
      },
      modal: {
        ondismiss: function () {
          setTriggerPayment(false);
        },
        escape: true,
        backdropclose: false,
      },
    };

    const rzp = new window.Razorpay(options);

    // Listen for payment failure
    rzp.on("payment.failed", function (response) {
      console.error("Payment failed:", response);
      updateWallet(Number(amount), response.error.metadata.payment_id, "failure");
      alert("Payment failed: " + response.error.description);
    });

    rzp.open();
  };

  useEffect(() => {
    if (triggerPayment) {
      if (!window.Razorpay) {
        alert("Razorpay SDK not loaded");
        return;
      }
      startRazorpay();
    }
  }, [triggerPayment]);

  const handleClick = () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      alert("Enter valid amount");
      return;
    }
    setTriggerPayment(true);
  };

  return (
    <div style={{ padding: "40px", maxWidth: "400px", margin: "auto" }}>
      <h2>Add Money to Wallet</h2>

      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{
          padding: "10px",
          width: "100%",
          marginBottom: "16px",
          fontSize: "16px",
        }}
      />

      <input
        type="tel"
        placeholder="Mobile number (optional)"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
        style={{
          padding: "10px",
          width: "100%",
          marginBottom: "16px",
          fontSize: "16px",
        }}
      />

      <button
        onClick={handleClick}
        style={{
          backgroundColor: "#00b894",
          color: "white",
          padding: "12px 20px",
          border: "none",
          borderRadius: "6px",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        Proceed to Pay
      </button>
    </div>
  );
};

export default AddMoney;
