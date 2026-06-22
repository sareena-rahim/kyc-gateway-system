import "./Dashboard.css";

import { Link, useNavigate } from "react-router-dom";

import {
  FaShieldAlt,
  FaBell,
  FaUsers,
  FaChartLine,
  FaCoins,
} from "react-icons/fa";

function Dashboard() {

    const navigate = useNavigate();
    const handleLogout = () => {
        navigate("/login");
    };
  return (
    <div className="dashboard-page">
      <nav className="navbar">
        <Link to="/dashboard" className="brand">
          <FaShieldAlt />
          <h2>KYC Gateway</h2>
        </Link>

        <div className="nav-links">
          <Link to="/dashboard" className="active">
            Dashboard
          </Link>

          <Link to="/services">
            Services
          </Link>
        </div>

        <div className="admin-profile">
    <FaBell />

        <div className="avatar">A</div>

         <button className="logout-btn" onClick={handleLogout}>
            Logout
        </button>
        </div>
      </nav>

      <div className="container">
        <div className="hero">
          <h1>Welcome back, Admin 👋</h1>

          <p>
            Monitor platform activity, service usage and client engagement.
          </p>
        </div>

        <div className="cards">
          <div className="card">
            <div className="card-header">
              <h3>Total Clients</h3>

              <div className="icon green">
                <FaUsers />
              </div>
            </div>

            <h2>0</h2>
          </div>

          <div className="card">
            <div className="card-header">
              <h3>Total Requests</h3>

              <div className="icon blue">
                <FaChartLine />
              </div>
            </div>

            <h2>0</h2>
          </div>

          <div className="card">
            <div className="card-header">
              <h3>Total Credits</h3>

              <div className="icon red">
                <FaCoins />
              </div>
            </div>

            <h2>100</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
