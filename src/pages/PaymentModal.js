import React, { useState } from "react";

const PaymentModal = ({ totalCost, onClose, onPaymentSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    if (paymentMethod === "wallet") {
      // Simulate wallet payment process
      setTimeout(() => {
        setLoading(false);
        alert("Wallet payment successful!");
        onPaymentSuccess();
      }, 1500);
    } else if (paymentMethod === "razorpay") {
      // Razorpay payment integration
      const options = {
        key: "rzp_test_ZOt9n5CnF4YG2Z", // replace with your Razorpay key
        amount: totalCost * 100, // amount in paise
        currency: "INR",
        name: "Vehicle Booking",
        description: "Booking Payment",
        handler: function (response) {
          alert("Payment successful, Razorpay payment id: " + response.razorpay_payment_id);
          onPaymentSuccess();
        },
        modal: {
          ondismiss: function () {
            alert("Payment popup closed");
            setLoading(false);
          },
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex", justifyContent: "center", alignItems: "center",
      zIndex: 1000,
    }}>
      <div style={{ backgroundColor: "white", padding: 20, borderRadius: 8, minWidth: 300 }}>
        <h3>Select Payment Method</h3>
        <div style={{ margin: "10px 0" }}>
          <label>
            <input
              type="radio"
              name="payment"
              value="wallet"
              checked={paymentMethod === "wallet"}
              onChange={() => setPaymentMethod("wallet")}
            />
            Wallet
          </label>
          <br />
          <label>
            <input
              type="radio"
              name="payment"
              value="razorpay"
              checked={paymentMethod === "razorpay"}
              onChange={() => setPaymentMethod("razorpay")}
            />
            Razorpay
          </label>
        </div>
        <button
          onClick={handlePayment}
          disabled={loading}
          style={{ marginRight: 10, padding: "8px 16px", cursor: "pointer" }}
        >
          {loading ? "Processing..." : "Pay ₹" + totalCost.toFixed(2)}
        </button>
        <button onClick={onClose} style={{ padding: "8px 16px", cursor: "pointer" }}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default PaymentModal;
