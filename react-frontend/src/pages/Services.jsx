import "./Services.css";

import { Link } from "react-router-dom";
import { FaShieldAlt, FaBell } from "react-icons/fa";

function Services() {
  return (
    <div className="services-page">
      <nav className="navbar">
        <Link to="/dashboard" className="brand">
          <FaShieldAlt />
          <h2>KYC Gateway</h2>
        </Link>

        <div className="nav-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/services" className="active">
            Services
          </Link>
        </div>

        <div className="admin-profile">
          <FaBell />
          <div className="avatar">A</div>
        </div>
      </nav>

      <div className="container">
        <div className="hero">
          <h1>Services ⚙️</h1>
          <p>
            Add and manage verification services for the KYC platform.
          </p>
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
                <tr>
                  <td>1</td>
                  <td>PAN_FETCH</td>
                  <td>PAN Verification</td>
                  <td>
                    <span className="status">Active</span>
                  </td>
                </tr>

                <tr>
                  <td>2</td>
                  <td>AADHAAR_FETCH</td>
                  <td>Aadhaar Verification</td>
                  <td>
                    <span className="status">Active</span>
                  </td>
                </tr>
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
              />
            </div>

            <div className="form-group">
              <label>Display Name</label>
              <input
                type="text"
                placeholder="e.g. PAN Verification"
              />
            </div>

            <button className="add-btn">
              Add Service
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Services;
