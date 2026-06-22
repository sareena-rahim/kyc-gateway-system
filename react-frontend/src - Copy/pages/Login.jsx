import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import {
  FaShieldAlt,
  FaUser,
  FaLock,
  FaIdCard,
  FaFileAlt,
  FaPlug,
  FaUserShield,
} from "react-icons/fa";

function Login() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Add API authentication here later
    navigate("/dashboard");
  };

  return (
    <div className="login-page">
      <div className="page-wrapper">
        <div className="info-panel">
          <h1>Secure Digital Identity Verification</h1>

          <p>
            KYC Gateway enables banks, NBFCs and fintech platforms to verify
            customer identities through a unified API ecosystem.
          </p>

          <div className="feature-list">
            <div className="feature-item">
              <FaIdCard />
              <span>PAN & Aadhaar Verification</span>
            </div>

            <div className="feature-item">
              <FaShieldAlt />
              <span>Role-Based Access Control</span>
            </div>

            <div className="feature-item">
              <FaFileAlt />
              <span>Centralized Audit Logs</span>
            </div>

            <div className="feature-item">
              <FaPlug />
              <span>Multi-Vendor API Integration</span>
            </div>
          </div>
        </div>

        <div className="login-container">
          <div className="login-card">
            <Link to="/login" className="brand-link">
              <div className="logo">
                <FaShieldAlt />
              </div>

              <h1>KYC Gateway</h1>
            </Link>

            <p className="subtitle">
              Secure access for Banks & NBFCs
            </p>

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <FaUser />
                <input
                  type="text"
                  placeholder="Username or Email"
                  required
                />
              </div>

              <div className="input-group">
                <FaLock />
                <input
                  type="password"
                  placeholder="Password"
                  required
                />
              </div>

              <div className="options">
                <label>
                  <input type="checkbox" /> Remember me
                </label>

                <a href="#">Forgot password?</a>
              </div>

              <button type="submit" className="login-btn">
                Sign In
              </button>

              <div className="divider">
                <span>OR</span>
              </div>

              <Link to="/admin-login" className="admin-btn">
                <FaUserShield />
                Admin Portal
              </Link>
            </form>

            <p className="footer-text">
              Secure verification platform for
              <span> Banks & NBFCs</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;