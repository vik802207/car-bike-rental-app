// src/components/Payment.js
import React, { useEffect } from "react";

const Payment = ({ amount, onSuccess, onClose,mobile }) => {
  useEffect(() => {
    const options = {
      key: "rzp_test_ZOt9n5CnF4YG2Z",
      amount: amount * 100,
      currency: "INR",
      name: "EpiCircle Wallet",
      description: "Add Funds",
      handler: function (response) {
        onSuccess(response);
      },
      prefill: {
        name: "User",
        email: "user@example.com",
        contact: mobile || ""
      },
      theme: {
        color: "#00b894",
      },
      modal: {
        ondismiss: function () {
          onClose();
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  }, [amount, onSuccess, onClose]);

  return null; // No visible UI
};

export default Payment;
