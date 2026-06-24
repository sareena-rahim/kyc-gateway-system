import "./APIKeys.css";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShieldAlt, FaBell, FaKey, FaCopy, FaCheck, FaSync, FaBan } from "react-icons/fa";

const API = "http://127.0.0.1:8000";

function APIKeys() {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [copied, setCopied] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal state
  const [modal, setModal] = useState({ open: false, type: "", client: null });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = () => {
    setLoading(true);
    fetch(`${API}/admin/clients`)
      .then(r => r.json())
      .then(data => { 
        console.log("CLIENT DATA:", data);
        setClients(data); 
        setLoading(false); })
      .catch(err => { 
        console.error(err); 
        setLoading(false); });
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 3000);
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const openModal = (type, client) => {
    setModal({ open: true, type, client });
  };

  const closeModal = () => {
    setModal({ open: false, type: "", client: null });
  };

  const regenerateKey = () => {
    const client = modal.client;
    closeModal();
    fetch(`${API}/admin/clients/${client.id}/regenerate-key`, { method: "POST" })
      .then(r => r.json())
      .then(data => {
        if (data.new_api_key) {
          showMessage(`New API key generated for ${client.name}`, "success");
          loadClients();
        } else {
          showMessage(data.detail || "Something went wrong", "error");
        }
      })
      .catch(() => showMessage("Failed to regenerate key", "error"));
  };

  const revokeKey = () => {
    const client = modal.client;
    closeModal();
    fetch(`${API}/admin/clients/${client.id}/revoke-key`, { method: "POST" })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          showMessage(`API key revoked for ${client.name}`, "success");
          loadClients();
        } else {
          showMessage(data.detail || "Something went wrong", "error");
        }
      })
      .catch(() => showMessage("Failed to revoke key", "error"));
  };

  const handleConfirm = () => {
    if (modal.type === "regenerate") regenerateKey();
    else if (modal.type === "revoke") revokeKey();
  };

  return (
    <div className="apikeys-page">
      {/* NAVBAR */}
      <nav className="navbar">
        <Link to="/dashboard" className="brand">
          <FaShieldAlt />
          <h2>KYC Gateway</h2>
        </Link>
        <div className="nav-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/clients">Clients</Link>
          <Link to="/services">Services</Link>
          <Link to="/subscriptions">Subscriptions</Link>
          <Link to="/api-keys" className="active">API Keys</Link>
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
        {/* HERO */}
        <div className="hero">
          <h1>API Key Management</h1>
          <p>View, regenerate, and revoke API keys for all clients.</p>
        </div>

        {/* ALERT */}
        {message && <div className={`alert ${messageType}`}>{message}</div>}

        {/* STATS ROW */}
        <div className="stats-row">
          <div className="stat-card total">
            <span className="stat-label">Total Clients</span>
            <span className="stat-value stat-box blue-bg">{clients.length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Active Keys</span>
            <span className="stat-value stat-box green-bg">{clients.filter(c => c.is_active).length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Revoked / Inactive</span>
            <span className="stat-value stat-box red-bg">{clients.filter(c => !c.is_active).length}</span>
          </div>
        </div>

        {/* TABLE */}
        <div className="panel">
          <h3>All Client API Keys</h3>

          {loading ? (
            <div className="loading">Loading clients...</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Company</th>
                  <th>Plan</th>
                  <th>API Key</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.length === 0 ? (
                  <tr><td colSpan="6" className="empty">No clients found</td></tr>
                ) : (
                  clients.map(c => (
                    <tr key={c.id}>
                      <td>{c.id}</td>
                      <td><strong>{c.name}</strong></td>
                      <td>
                        <span className={`plan-badge ${c.subscription_plan?.toLowerCase()}`}>
                          {c.subscription_plan || "Basic"}
                        </span>
                      </td>
                      <td>
                        <div className="api-key-cell">
                          <code className={!c.is_active ? "revoked" : ""}>
                            {c.is_active ? c.api_key : "— revoked —"}
                          </code>
                          {c.is_active && (
                            <button
                              className="icon-btn"
                              title="Copy API Key"
                              onClick={() => copyToClipboard(c.api_key, c.id)}
                            >
                              {copied === c.id ? <FaCheck color="#27ae60" /> : <FaCopy />}
                            </button>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${c.is_active ? "active" : "inactive"}`}>
                          {c.is_active ? "Active" : "Revoked"}
                        </span>
                      </td>
                      <td className="actions">
                        <button
                          className="btn regenerate"
                          title="Generate a new API key"
                          onClick={() => openModal("regenerate", c)}
                        >
                          <FaSync /> Regenerate
                        </button>
                        <button
                          className="btn revoke"
                          title="Revoke this API key"
                          disabled={!c.is_active}
                          onClick={() => openModal("revoke", c)}
                        >
                          <FaBan /> Revoke
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* CONFIRMATION MODAL */}
      {modal.open && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className={`modal-icon ${modal.type}`}>
              {modal.type === "regenerate" ? <FaSync /> : <FaBan />}
            </div>
            <h3>
              {modal.type === "regenerate" ? "Regenerate API Key?" : "Revoke API Key?"}
            </h3>
            <p>
              {modal.type === "regenerate"
                ? <>The current key for <strong>{modal.client?.name}</strong> will be replaced. Any app using the old key will stop working immediately.</>
                : <>This will permanently revoke the API key for <strong>{modal.client?.name}</strong>. They won't be able to make API calls until a new key is issued.</>
              }
            </p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={closeModal}>Cancel</button>
              <button
                className={`btn-confirm ${modal.type}`}
                onClick={handleConfirm}
              >
                {modal.type === "regenerate" ? "Yes, Regenerate" : "Yes, Revoke"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default APIKeys;