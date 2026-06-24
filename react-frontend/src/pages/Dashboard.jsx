//import "./Navbar.css";
import "./Dashboard.css";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShieldAlt, FaBell, FaUsers, FaChartLine, FaCoins } from "react-icons/fa";

const API = "http://127.0.0.1:8000";

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total_clients: 0, total_services: 0, total_credits_used: 0 });

  useEffect(() => {
    fetch(`${API}/admin/stats`)
      .then(r => r.json())
      .then(data => setStats(data))
      .catch(err => console.error(err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/admin-login");
  };

  return (
    <div className="dashboard-page">
      <nav className="navbar">
        <Link to="/dashboard" className="brand">
          <FaShieldAlt />
          <h2>KYC Gateway</h2>
        </Link>
        <div className="nav-links">
          <Link to="/dashboard" className="active">Dashboard</Link>
          <Link to="/clients">Clients</Link>
          <Link to="/services">Services</Link>
          <Link to="/subscriptions">Subscriptions</Link>
          <Link to="/api-keys">API Keys</Link>
          
        </div>
        <div className="admin-profile">
          <FaBell />
          <div className="avatar">A</div>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="container">
        <div className="hero">
          <h1>Welcome back, Admin 👋</h1>
          <p>Monitor platform activity, service usage and client engagement.</p>
        </div>

        <div className="cards">
          <div className="card">
            <div className="card-header">
              <h3>Total Clients</h3>
              <div className="icon green"><FaUsers /></div>
            </div>
            <h2>{stats.total_clients}</h2>
          </div>
          <div className="card">
            <div className="card-header">
              <h3>Total Requests</h3>
              <div className="icon blue"><FaChartLine /></div>
            </div>
            <h2>{stats.total_credits_used}</h2>
          </div>
          <div className="card">
            <div className="card-header">
              <h3>Total Services</h3>
              <div className="icon red"><FaCoins /></div>
            </div>
            <h2>{stats.total_services}</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
