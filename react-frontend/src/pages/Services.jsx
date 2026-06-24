//import "./Navbar.css";
import "./Services.css";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShieldAlt, FaBell } from "react-icons/fa";

const API = "http://127.0.0.1:8000";

function Services() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [serviceCode, setServiceCode] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = () => {
    fetch(`${API}/admin/services`)
      .then(r => r.json())
      .then(data => setServices(data))
      .catch(err => console.error("Failed to fetch services:", err));
  };

  const addService = () => {
    if (!serviceCode || !displayName) {
      setMessage("Please fill in all fields");
      setMessageType("error");
      return;
    }

    fetch(`${API}/admin/services`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_code: serviceCode.toUpperCase(),
        display_name: displayName
      })
    })
      .then(r => r.json())
      .then(data => {
        if (data.id) {
          setMessage("Service added successfully!");
          setMessageType("success");
          setServiceCode("");
          setDisplayName("");
          loadServices();
        } else {
          setMessage(data.detail || "Something went wrong");
          setMessageType("error");
        }
        setTimeout(() => setMessage(""), 3000);
      });
  };

  return (
    <div className="services-page">
      <nav className="navbar">
        <Link to="/dashboard" className="brand">
          <FaShieldAlt />
          <h2>KYC Gateway</h2>
        </Link>
        <div className="nav-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/clients">Clients</Link>
          <Link to="/services" className="active">Services</Link>
          <Link to="/subscriptions">Subscriptions</Link>
          <Link to="/api-keys">API Keys</Link>
        </div>
        <div className="admin-profile">
          <FaBell />
          <div className="avatar">A</div>
          <button className="logout-btn" onClick={() => {
            localStorage.removeItem("isAdmin");
            navigate("/admin-login");
          }}>Logout</button>
        </div>
      </nav>

      <div className="container">
        <div className="hero">
          <h1>Services ⚙️</h1>
          <p>Add and manage verification services for the KYC platform.</p>
        </div>

        <div className="grid">
          <div className="card">
            <h3>Available Services</h3>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Service Code</th>
                  <th>Display Name</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {services.length === 0 ? (
                  <tr><td colSpan="4">Loading...</td></tr>
                ) : (
                  services.map(s => (
                    <tr key={s.id}>
                      <td>{s.id}</td>
                      <td>{s.service_code}</td>
                      <td>{s.display_name}</td>
                      <td><span className="status">Active</span></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="card">
            <h3>Add New Service</h3>
            <div className="form-group">
              <label>Service Code</label>
              <input
                type="text"
                placeholder="e.g. PAN_FETCH"
                value={serviceCode}
                onChange={e => setServiceCode(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Display Name</label>
              <input
                type="text"
                placeholder="e.g. PAN Verification"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
              />
            </div>
            <button className="add-btn" onClick={addService}>
              Add Service
            </button>
            {message && (
              <p className={`message ${messageType}`}>{message}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Services;