import "./Subscriptions.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShieldAlt, FaBell, FaUsers, FaCheckCircle, FaClock, FaCoins } from "react-icons/fa";

const initialSubscriptions = [
  { id: 1, client: "ABC Bank", plan: "Basic", status: "Pending", credits: 0 },
  { id: 2, client: "XYZ NBFC", plan: "Premium", status: "Active", credits: 1000 },
  { id: 3, client: "FinServe Ltd", plan: "Standard", status: "Active", credits: 500 },
  { id: 4, client: "QuickLoans", plan: "Basic", status: "Pending", credits: 0 },
  { id: 5, client: "TrustBank", plan: "Premium", status: "Rejected", credits: 0 },
];

function Subscriptions() {
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState(initialSubscriptions);
  const [editId, setEditId] = useState(null);
  const [editCredits, setEditCredits] = useState("");
  const [editPlan, setEditPlan] = useState("");

  const handleApprove = (id) => {
    setSubscriptions(prev =>
      prev.map(s => s.id === id ? { ...s, status: "Active" } : s)
    );
  };

  const handleReject = (id) => {
    setSubscriptions(prev =>
      prev.map(s => s.id === id ? { ...s, status: "Rejected" } : s)
    );
  };

  const handleEdit = (sub) => {
    setEditId(sub.id);
    setEditCredits(sub.credits);
    setEditPlan(sub.plan);
  };

  const handleSave = (id) => {
    setSubscriptions(prev =>
      prev.map(s => s.id === id ? { ...s, credits: Number(editCredits), plan: editPlan } : s)
    );
    setEditId(null);
  };

  const total       = subscriptions.length;
  const pending     = subscriptions.filter(s => s.status === "Pending").length;
  const active      = subscriptions.filter(s => s.status === "Active").length;
  const totalCredits = subscriptions.reduce((sum, s) => sum + s.credits, 0);

  return (
    <div className="subs-page">
      <nav className="navbar">
        <Link to="/dashboard" className="brand">
          <FaShieldAlt />
          <h2>KYC Gateway</h2>
        </Link>
        <div className="nav-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/clients">Clients</Link>
          <Link to="/services">Services</Link>
          <Link to="/subscriptions" className="active">Subscriptions</Link>
          <Link to="/api-keys">API Keys</Link>
        </div>
        <div className="admin-profile">
          <FaBell />
          <div className="avatar">A</div>
          <button className="logout-btn" onClick={() => navigate("/login")}>Logout</button>
        </div>
      </nav>

      <div className="container">
        <div className="hero">
          <h1>Subscription Management</h1>
          <p>Approve, reject and manage client subscription plans.</p>
        </div>

        {/* SUMMARY CARDS */}
        <div className="cards">
          <div className="card">
            <div className="card-header">
              <h3>Total Clients</h3>
              <div className="icon green"><FaUsers /></div>
            </div>
            <h2>{total}</h2>
          </div>
          <div className="card">
            <div className="card-header">
              <h3>Pending Requests</h3>
              <div className="icon orange"><FaClock /></div>
            </div>
            <h2>{pending}</h2>
          </div>
          <div className="card">
            <div className="card-header">
              <h3>Active Plans</h3>
              <div className="icon blue"><FaCheckCircle /></div>
            </div>
            <h2>{active}</h2>
          </div>
          <div className="card">
            <div className="card-header">
              <h3>Credits Allocated</h3>
              <div className="icon red"><FaCoins /></div>
            </div>
            <h2>{totalCredits}</h2>
          </div>
        </div>

        {/* TABLE */}
        <div className="table-section">
          <h3>All Subscriptions</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Client</th>
                <th>Plan</th>
                <th>Status</th>
                <th>Credits</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map(sub => (
                <tr key={sub.id}>
                  <td>{sub.id}</td>
                  <td><strong>{sub.client}</strong></td>
                  <td>
                    {editId === sub.id ? (
                      <select value={editPlan} onChange={e => setEditPlan(e.target.value)}>
                        <option>Basic</option>
                        <option>Standard</option>
                        <option>Premium</option>
                      </select>
                    ) : (
                      <span className={`plan ${sub.plan.toLowerCase()}`}>{sub.plan}</span>
                    )}
                  </td>
                  <td>
                    <span className={`badge ${sub.status.toLowerCase()}`}>{sub.status}</span>
                  </td>
                  <td>
                    {editId === sub.id ? (
                      <input
                        type="number"
                        value={editCredits}
                        onChange={e => setEditCredits(e.target.value)}
                        className="credits-input"
                      />
                    ) : sub.credits}
                  </td>
                  <td className="actions">
                    {sub.status === "Pending" && (
                      <>
                        <button className="btn approve" onClick={() => handleApprove(sub.id)}>Approve</button>
                        <button className="btn reject" onClick={() => handleReject(sub.id)}>Reject</button>
                      </>
                    )}
                    {sub.status === "Active" && editId !== sub.id && (
                      <button className="btn edit" onClick={() => handleEdit(sub)}>Edit</button>
                    )}
                    {editId === sub.id && (
                      <button className="btn save" onClick={() => handleSave(sub.id)}>Save</button>
                    )}
                    {sub.status === "Rejected" && (
                      <span className="rejected-text">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Subscriptions;