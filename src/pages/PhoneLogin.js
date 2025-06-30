import { useState } from "react";
import { auth } from "../firebase";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

function PhoneLogin() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const setupRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
      callback: () => {
        handleSendOtp();
      },
      "expired-callback": () => {
        setError("ReCAPTCHA expired. Please try again.");
      },
    });
  };

  const handleSendOtp = async () => {
    setError("");
    if (!phone.startsWith("+")) {
      setError("Phone number must start with country code, e.g. +91...");
      return;
    }

    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;

    try {
      const result = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmationResult(result);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await confirmationResult.confirm(otp);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid OTP. Try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Phone OTP Login</h2>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        {!confirmationResult ? (
          <>
            <input
              type="tel"
              placeholder="Phone (with +91...)"
              className="w-full p-2 border rounded mb-3"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <div id="recaptcha-container"></div>
            <button
              onClick={handleSendOtp}
              className="w-full bg-green-600 text-white p-2 rounded"
            >
              Send OTP
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full p-2 border rounded mb-3"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              onClick={handleVerifyOtp}
              className="w-full bg-blue-600 text-white p-2 rounded"
            >
              Verify OTP
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default PhoneLogin;
