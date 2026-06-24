import "./AdminLogin.css";
import { Link, useNavigate } from "react-router-dom";
import { FaShieldAlt, FaUser, FaLock, FaArrowLeft } from "react-icons/fa";

function AdminLogin() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const username = e.target[0].value;
    const password = e.target[1].value;

    if (username === "admin" && password === "admin123") {
      localStorage.setItem("isAdmin", "true");
      navigate("/dashboard");
    } else {
      alert("Invalid admin credentials");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <Link to="/admin-login" className="brand-link">
            <div className="logo">
              <FaShieldAlt />
            </div>
            <h1>KYC Gateway</h1>
          </Link>

          <p className="subtitle">Secure access to the Admin Panel</p>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <FaUser />
              <input type="text" placeholder="Username or Email" required />
            </div>

            <div className="input-group">
              <FaLock />
              <input type="password" placeholder="Password" required />
            </div>

            <div className="options">
              <label><input type="checkbox" /> Remember me</label>
              <a href="#">Forgot password?</a>
            </div>

            <button type="submit" className="login-btn">Sign In</button>

            <Link to="/" className="back-btn">
              <FaArrowLeft />
              Back to User Portal
            </Link>
          </form>

          <p className="footer-text">
            Secure verification platform for <span>Banks & NBFCs</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;