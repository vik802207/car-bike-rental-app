import { useState } from "react";
import { auth, googleProvider } from "../firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <h3>New Scheduling And Routing Options</h3>
        <p>We’ve updated how you schedule rides and view your rental rewards.</p>
        <img src="/6.png" alt="Login Visual" className="login-illustration" />
      </div>

      <div className="login-right">
        <div className="login-box">
          <h2>Hello Again!</h2>
          <p>Login to continue</p>

          {error && <p className="login-error">{error}</p>}

          <form onSubmit={handleLogin}>
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

            <div className="login-options">
              <label><input type="checkbox" /> Remember Me</label>
              <span className="forgot">Recovery Password</span>
            </div>

            <button type="submit" className="btn login-btn">Login</button>

            <button type="button" onClick={handleGoogleLogin} className="btn google-btn">
              Sign in with Google
            </button>
          </form>

          <p className="signup-text">
            Don’t have an account yet? <span className="signup-link" onClick={()=>navigate('/signup')}>Sign Up</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
