import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(
      (user) => user.email === email && user.password === password
    );

    if (user) {
      // Save login info (optional, for session)
      localStorage.setItem("currentUser", JSON.stringify(user));

      alert("Login Successful!");
      navigate("/"); // redirect to home/main page
    } else {
      alert("Invalid Email or Password!");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Member Login 🎬</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="auth-btn" onClick={handleLogin}>
          Login
        </button>

        <p>
          Don’t have an account? <Link to="/register">Create Account</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;