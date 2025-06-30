import React, { useState } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./AdminLoginSignup.css";

const AdminLoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        if (email.endsWith(".admin@gmail.com")) {
          navigate("/admin/dashboard");
        } else {
          alert("You are not authorized as admin.");
          await auth.signOut();
        }

      } else {
        if (email.endsWith(".admin@gmail.com")) {
          await createUserWithEmailAndPassword(auth, email, password);
          alert("Admin signup successful. Please log in.");
          setIsLogin(true);
        } else {
          alert("Only emails ending with .admin@gmail.com can sign up as admin.");
        }
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">{isLogin ? "Admin Login" : "Admin Signup"}</h2>

      {error && <p className="auth-error">{error}</p>}

      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="auth-input"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="auth-input"
        />

        <button type="submit" disabled={loading} className="auth-button">
          {loading ? (isLogin ? "Logging in..." : "Signing up...") : (isLogin ? "Login" : "Signup")}
        </button>
      </form>

      <p className="auth-toggle">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          onClick={() => {
            setError("");
            setIsLogin(!isLogin);
          }}
          className="auth-toggle-link"
        >
          {isLogin ? "Signup" : "Login"}
        </button>
      </p>
    </div>
  );
};

export default AdminLoginSignup;
