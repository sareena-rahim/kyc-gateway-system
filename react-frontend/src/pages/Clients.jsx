//import "./Navbar.css";
import "./Clients.css";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShieldAlt, FaBell, FaKey, FaCopy, FaCheck } from "react-icons/fa";

const API = "http://127.0.0.1:8000";

function Clients() {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [copied, setCopied] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [topupClientKey, setTopupClientKey] = useState("");
  const [topupAmount, setTopupAmount] = useState("");
  const [activeTab, setActiveTab] = useState("list");

  // Create client form
  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
    api_key: "",
    subscription_plan: "Basic"
  });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = () => {
    fetch(`${API}/admin/clients`)
      .then(r => r.json())
      .then(data => setClients(data))
      .catch(err => console.error(err));
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 3000);
  };

  const createClient = () => {
    if (!form.name || !form.username || !form.password) {
      showMessage("Please fill in all required fields", "error");
      return;
    }

    fetch(`${API}/admin/clients`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })
      .then(r => r.json())
      .then(data => {
        if (data.id) {
          showMessage("Client created successfully!", "success");
          setForm({ name: "", username: "", password: "", api_key: "", subscription_plan: "Basic" });
          loadClients();
          setActiveTab("list");
        } else {
          showMessage(data.detail || "Something went wrong", "error");
        }
      });
  };

  const topupCredits = () => {
    if (!topupClientKey || !topupAmount) {
      showMessage("Please select a client and enter amount", "error");
      return;
    }

    fetch(`${API}/admin/clients/topup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: topupClientKey, amount: parseInt(topupAmount) })
    })
      .then(r => r.json())
      .then(data => {
        if (data.new_balance !== undefined) {
          showMessage(`Credits added! New balance: ${data.new_balance}`, "success");
          setTopupClientKey("");
          setTopupAmount("");
          loadClients();
        } else {
          showMessage(data.detail || "Something went wrong", "error");
        }
      });
  };

  const disableClient = (apiKey) => {
    if (!window.confirm("Are you sure you want to disable this client?")) return;
    showMessage("Disable feature coming soon", "error");
  };

  return (
    <div className="clients-page">
      <nav className="navbar">
        <Link to="/dashboard" className="brand">
          <FaShieldAlt />
          <h2>KYC Gateway</h2>
        </Link>
        <div className="nav-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/clients" className="active">Clients</Link>
          <Link to="/services">Services</Link>
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
          <h1>Client Management</h1>
          <p>Create, manage and monitor all KYC Gateway clients.</p>
        </div>

        {message && <div className={`alert ${messageType}`}>{message}</div>}

        {/* TABS */}
        <div className="tabs">
          <button className={activeTab === "list" ? "tab active" : "tab"} onClick={() => setActiveTab("list")}>
            All Clients
          </button>
          <button className={activeTab === "create" ? "tab active" : "tab"} onClick={() => setActiveTab("create")}>
            + Create Client
          </button>
          <button className={activeTab === "topup" ? "tab active" : "tab"} onClick={() => setActiveTab("topup")}>
            Top Up Credits
          </button>
        </div>

        {/* ALL CLIENTS */}
        {activeTab === "list" && (
          <div className="panel">
            <h3>Registered Clients ({clients.length})</h3>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Company</th>
                  <th>API Key</th>
                  <th>Credits</th>
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
                        <div className="api-key-cell">
                          <code>{c.api_key}</code>
                          <button className="icon-btn" onClick={() => copyToClipboard(c.api_key, c.id)}>
                            {copied === c.id ? <FaCheck color="#27ae60" /> : <FaCopy />}
                          </button>
                        </div>
                      </td>
                      <td><strong>{c.balance}</strong></td>
                      <td>
                        <span className={`badge ${c.is_active ? "active" : "inactive"}`}>
                          {c.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="actions">
                        <button className="btn disable" onClick={() => disableClient(c.api_key)}>Disable</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* CREATE CLIENT */}
        {activeTab === "create" && (
          <div className="panel form-panel">
            <h3>Create New Client</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Company Name *</label>
                <input
                  type="text"
                  placeholder="e.g. ABC Bank"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Username *</label>
                <input
                  type="text"
                  placeholder="e.g. abcbank_user"
                  value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Password *</label>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Subscription Plan</label>
                <select value={form.subscription_plan} onChange={e => setForm({ ...form, subscription_plan: e.target.value })}>
                  <option>Basic</option>
                  <option>Standard</option>
                  <option>Premium</option>
                </select>
              </div>
              <div className="form-group full-width">
                <label>Custom API Key (optional — leave blank to auto-generate)</label>
                <div className="api-key-input">
                  <FaKey />
                  <input
                    type="text"
                    placeholder="Leave blank to auto-generate"
                    value={form.api_key}
                    onChange={e => setForm({ ...form, api_key: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <button className="submit-btn" onClick={createClient}>Create Client</button>
          </div>
        )}

        {/* TOP UP CREDITS */}
        {activeTab === "topup" && (
          <div className="panel form-panel">
            <h3>Top Up Client Credits</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Select Client</label>
                <select value={topupClientKey} onChange={e => setTopupClientKey(e.target.value)}>
                  <option value="">-- Select a client --</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.api_key}>{c.name} (Balance: {c.balance})</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Amount to Add</label>
                <input
                  type="number"
                  placeholder="e.g. 100"
                  value={topupAmount}
                  onChange={e => setTopupAmount(e.target.value)}
                />
              </div>
            </div>
            <button className="submit-btn" onClick={topupCredits}>Add Credits</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Clients;