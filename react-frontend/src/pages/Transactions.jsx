import { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "http://127.0.0.1:8001";

export default function Transactions() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clientName, setClientName] = useState("");
  const [filter, setFilter] = useState("ALL");

  const params = new URLSearchParams(window.location.search);
  const apiKey = params.get("api_key") || "";

  useEffect(() => {
    if (apiKey) {
      loadLogs();
      loadClientInfo();
    }
  }, []);

  async function loadClientInfo() {
    try {
      const res = await axios.get(`${BASE_URL}/api/kyc/balance?client_api_key=${apiKey}`);
      setClientName(res.data.client);
    } catch (e) {
      setClientName("Client");
    }
  }

  async function loadLogs() {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/kyc/logs?client_api_key=${apiKey}`);
      setLogs(res.data.logs || []);
    } catch (e) {
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }

  const filteredLogs = filter === "ALL"
    ? logs
    : logs.filter(log => log.status === filter);

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: "#eef2ff", minHeight: "100vh" }}>

      {/* Navbar */}
      <nav style={{
        background: "white", padding: "16px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: "1px solid #e2e8f0", boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 36, height: 36, background: "#2563eb",
            borderRadius: 8, display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 18
          }}>🛡️</div>
          <span style={{ fontWeight: 700, fontSize: 16 }}>KYC Gateway</span>
        </div>
        <button
          onClick={() => window.location.href = `/dashboard?api_key=${apiKey}`}
          style={{
            background: "#2563eb", color: "white", border: "none",
            borderRadius: 8, padding: "8px 16px", fontSize: 13,
            fontWeight: 600, cursor: "pointer"
          }}>
          ← Dashboard
        </button>
      </nav>

      {/* Container */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: 32 }}>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1e293b" }}>
            📋 Transaction History
          </h2>
          <p style={{ color: "#94a3b8", fontSize: 14, marginTop: 4 }}>
            All KYC verification requests for {clientName}
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 24 }}>
          <div style={{
            background: "white", borderRadius: 12, padding: "20px 24px",
            border: "1px solid #f1f5f9", boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
          }}>
            <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 4 }}>TOTAL REQUESTS</p>
            <p style={{ fontSize: 28, fontWeight: 700, color: "#1e293b" }}>{logs.length}</p>
          </div>
          <div style={{
            background: "white", borderRadius: 12, padding: "20px 24px",
            border: "1px solid #f1f5f9", boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
          }}>
            <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 4 }}>SUCCESSFUL</p>
            <p style={{ fontSize: 28, fontWeight: 700, color: "#16a34a" }}>
              {logs.filter(l => l.status === "SUCCESS").length}
            </p>
          </div>
          <div style={{
            background: "white", borderRadius: 12, padding: "20px 24px",
            border: "1px solid #f1f5f9", boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
          }}>
            <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 4 }}>FAILED</p>
            <p style={{ fontSize: 28, fontWeight: 700, color: "#ef4444" }}>
              {logs.filter(l => l.status === "FAILED").length}
            </p>
          </div>
        </div>

        {/* Filter + Table */}
        <div style={{
          background: "white", borderRadius: 16, padding: 24,
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9"
        }}>
          {/* Filter buttons */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: "#1e293b" }}>All Transactions</h3>
            <div style={{ display: "flex", gap: 8 }}>
              {["ALL", "SUCCESS", "FAILED", "INITIATED"].map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{
                  padding: "6px 14px", borderRadius: 8, fontSize: 12,
                  fontWeight: 600, cursor: "pointer", border: "1px solid",
                  background: filter === f ? "#2563eb" : "white",
                  color: filter === f ? "white" : "#64748b",
                  borderColor: filter === f ? "#2563eb" : "#e2e8f0"
                }}>{f}</button>
              ))}
              <button onClick={loadLogs} style={{
                padding: "6px 14px", borderRadius: 8, fontSize: 12,
                fontWeight: 600, cursor: "pointer", border: "1px solid #e2e8f0",
                background: "white", color: "#64748b"
              }}>🔄 Refresh</button>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <p style={{ textAlign: "center", color: "#94a3b8", padding: 32 }}>Loading...</p>
          ) : filteredLogs.length === 0 ? (
            <p style={{ textAlign: "center", color: "#94a3b8", padding: 32 }}>No transactions found</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Transaction ID", "Service", "Status", "Date"].map(h => (
                    <th key={h} style={{
                      textAlign: "left", fontSize: 11, color: "#94a3b8",
                      padding: "10px 16px", borderBottom: "1px solid #f1f5f9",
                      textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 600
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map(log => (
                  <tr key={log.transaction_id} style={{ borderBottom: "1px solid #f8fafc" }}>
                    <td style={{ padding: "14px 16px" }}>
                      <code style={{
                        background: "#f1f5f9", padding: "3px 8px",
                        borderRadius: 4, fontSize: 12, color: "#2563eb"
                      }}>
                        {log.transaction_id}
                      </code>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#475569" }}>
                      {log.service}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{
                        padding: "4px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600,
                        background: log.status === "SUCCESS" ? "#f0fdf4" : log.status === "FAILED" ? "#fef2f2" : "#f1f5f9",
                        color: log.status === "SUCCESS" ? "#16a34a" : log.status === "FAILED" ? "#ef4444" : "#64748b",
                        border: `1px solid ${log.status === "SUCCESS" ? "#dcfce7" : log.status === "FAILED" ? "#fee2e2" : "#e2e8f0"}`
                      }}>{log.status}</span>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#475569" }}>
                      {new Date(log.created_at + "Z").toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}