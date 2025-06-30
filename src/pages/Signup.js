import { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-left">
        <h3>New Booking and Route Features!</h3>
        <p>Create your account to access amazing features.</p>
        <img src="/6.png" alt="Signup Visual" className="signup-illustration" />
      </div>

      <div className="signup-right">
        <div className="signup-box">
          <h2>Create Account</h2>
          <p>Sign up to get started</p>

          {error && <p className="signup-error">{error}</p>}

          <form onSubmit={handleSignup}>
            <div className="input-group">
              <input
                type="email"
                placeholder="Email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn signup-btn">Sign Up</button>
          </form>

          <p className="login-text">
            Already have an account? <span className="login-link" onClick={() => navigate("/login")}>Login</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
