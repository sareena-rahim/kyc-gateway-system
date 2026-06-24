import { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "http://127.0.0.1:8001";

export default function ClientDashboard() {
  const [apiKey, setApiKey] = useState("");
  const [clientName, setClientName] = useState("");
  const [balance, setBalance] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(null);
  const [subscriptionPlan, setSubscriptionPlan] = useState(null);
  const [service, setService] = useState("PAN_FETCH");
  const [panInput, setPanInput] = useState("");
  const [aadhaarInput, setAadhaarInput] = useState("");
  const [result, setResult] = useState(null);
  const [resultError, setResultError] = useState("");
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const key = params.get("api_key") || "";
    setApiKey(key);
    if (key) {
      loadClientData(key);
    } else {
      window.location.href = "/login";
    }
  }, []);

  async function loadClientData(key) {
    try {
      // Load balance
      const balanceRes = await axios.get(`${BASE_URL}/api/kyc/balance?client_api_key=${key}`);
      setClientName(balanceRes.data.client);
      setBalance(balanceRes.data.balance);

      // Check subscription
      const subRes = await axios.get(`${BASE_URL}/api/kyc/subscription?client_api_key=${key}`);
      setIsSubscribed(subRes.data.is_subscribed);
      setSubscriptionPlan(subRes.data.subscription_plan);

      if (subRes.data.is_subscribed) {
        loadLogs(key);
      }
    } catch (e) {
      console.error("Error loading client data:", e);
    } finally {
      setPageLoading(false);
    }
  }

  async function loadLogs(key) {
    try {
      const res = await axios.get(`${BASE_URL}/api/kyc/logs?client_api_key=${key}`);
      setLogs(res.data.logs || []);
    } catch (e) {
      setLogs([]);
    }
  }

  async function submitKYC() {
    setLoading(true);
    setResult(null);
    setResultError("");

    if (service === "PAN_FETCH" && !panInput) {
      setResultError("Please enter a PAN number!");
      setLoading(false);
      return;
    }
    if (service === "AADHAAR_VERIFY" && !aadhaarInput) {
      setResultError("Please enter an Aadhaar number!");
      setLoading(false);
      return;
    }

    const payload = service === "PAN_FETCH"
      ? { pan_number: panInput }
      : { aadhaar_number: aadhaarInput };

    try {
      const res = await axios.post(`${BASE_URL}/api/kyc/request`, {
        client_api_key: apiKey,
        service_code: service,
        payload
      });
      setResult(res.data);
      setBalance(res.data.credits_remaining);
      loadLogs(apiKey);
    } catch (e) {
      setResultError(e.response?.data?.detail || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  }

  // Loading state
  if (pageLoading) {
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        minHeight: "100vh", background: "#f8fafc",
        fontFamily: "'Segoe UI', sans-serif"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🛡️</div>
          <p style={{ color: "#64748b", fontSize: 15 }}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Not subscribed — show subscription prompt
  if (!isSubscribed) {
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
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 13, color: "#64748b" }}>
              Welcome, <strong style={{ color: "#1e293b" }}>{clientName}</strong>
            </span>
            <button onClick={() => window.location.href = "/"} style={{
              background: "#f1f5f9", border: "none", borderRadius: 8,
              padding: "8px 16px", fontSize: 13, color: "#64748b", cursor: "pointer"
            }}>Logout</button>
          </div>
        </nav>

        {/* Not subscribed content */}
        <div style={{
          maxWidth: 600, margin: "80px auto", padding: 32, textAlign: "center"
        }}>
          <div style={{
            background: "white", borderRadius: 20, padding: 48,
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)", border: "1px solid #f1f5f9"
          }}>
            <div style={{ fontSize: 56, marginBottom: 20 }}>🔒</div>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: "#1e293b", marginBottom: 12 }}>
              Subscription Required
            </h2>
            <p style={{ color: "#64748b", fontSize: 15, lineHeight: 1.6, marginBottom: 32 }}>
              You need an active subscription to access KYC verification services.
              Choose a plan that suits your needs.
            </p>
            <button
              onClick={() => window.location.href = `/subscribe?api_key=${apiKey}&name=${clientName}`}
              style={{
                padding: "14px 32px", background: "#2563eb",
                color: "white", border: "none", borderRadius: 10,
                fontSize: 15, fontWeight: 600, cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              View Subscription Plans →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Subscribed — show full dashboard
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
            width: 36, height: 36, background: "#1e3a8a",
            borderRadius: 8, display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 18
          }}>🛡️</div>
          <span style={{ fontWeight: 700, fontSize: 16 }}>KYC Gateway</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontWeight: 600, fontSize: 13, margin: 0 }}>{clientName}</p>
            <span style={{ fontSize: 11, color: "#94a3b8" }}>{subscriptionPlan} Plan</span>
          </div>
          <div style={{
            background: "#eff6ff", border: "1px solid #bfdbfe",
            borderRadius: 999, padding: "6px 16px",
            fontSize: 13, fontWeight: 600, color: "#2563eb"
          }}>
            💳 {balance ?? "-"} credits
          </div>
          <button onClick={() => window.location.href = "/"} style={{
            background: "#f1f5f9", border: "none", borderRadius: 8,
            padding: "8px 16px", fontSize: 13, color: "#64748b", cursor: "pointer"
          }}>Logout</button>
        </div>
      </nav>

      {/* Container */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: 32 }}>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1e293b" }}>KYC Verification</h2>
          <p style={{ color: "#94a3b8", fontSize: 14, marginTop: 4 }}>
            Submit a PAN or Aadhaar number for instant verification
          </p>
        </div>

   <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 20,
    marginBottom: 32
  }}
>
  <div
    onClick={() =>
      window.location.href = `/profile?api_key=${apiKey}`
    }
    style={{
      background: "#ffffff",
      border: "1px solid #dbeafe",
      borderRadius: 16,
      padding: 24,
      cursor: "pointer",
      boxShadow: "0 4px 12px rgba(15,23,42,0.05)",
      transition: "0.2s"
    }}
  >
    <div style={{ fontSize: 28, marginBottom: 12 }}>👤</div>
    <h3
      style={{
        margin: 0,
        color: "#0f172a",
        fontSize: 16,
        fontWeight: 600
      }}
    >
      Profile
    </h3>
    <p
      style={{
        marginTop: 8,
        color: "#64748b",
        fontSize: 13
      }}
    >
      View account information and API key
    </p>
  </div>

  <div
    onClick={() =>
      window.location.href = `/subscribe?api_key=${apiKey}&name=${clientName}`
    }
    style={{
      background: "#ffffff",
      border: "1px solid #dbeafe",
      borderRadius: 16,
      padding: 24,
      cursor: "pointer",
      boxShadow: "0 4px 12px rgba(15,23,42,0.05)"
    }}
  >
    <div style={{ fontSize: 28, marginBottom: 12 }}>💳</div>
    <h3
      style={{
        margin: 0,
        color: "#0f172a",
        fontSize: 16,
        fontWeight: 600
      }}
    >
      Subscription
    </h3>
    <p
      style={{
        marginTop: 8,
        color: "#64748b",
        fontSize: 13
      }}
    >
      Manage your active plan and credits
    </p>
  </div>
    <div
     onClick={() => window.location.href = `/api-docs?api_key=${apiKey}`}
     style={{
     background: "#ffffff", border: "1px solid #dbeafe",
     borderRadius: 16, padding: 24, cursor: "pointer",
     boxShadow: "0 4px 12px rgba(15,23,42,0.05)"
  }}
>
  <div style={{ fontSize: 28, marginBottom: 12 }}>📖</div>
  <h3 style={{ margin: 0, color: "#0f172a", fontSize: 16, fontWeight: 600 }}>API Docs</h3>
  <p style={{ marginTop: 8, color: "#64748b", fontSize: 13 }}>How to integrate our API</p>
</div>
</div>
        {/* KYC Card */}
        <div style={{
          background: "white", borderRadius: 16, padding: 32,
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          border: "1px solid #f1f5f9", marginBottom: 24
        }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 20, color: "#1e293b" }}>
            🔍 New Verification Request
          </h3>

          {/* Service Toggle */}
          <div style={{
            display: "flex", background: "#f1f5f9",
            borderRadius: 10, padding: 4, marginBottom: 24
          }}>
            {["PAN_FETCH", "AADHAAR_VERIFY"].map(s => (
              <button key={s} onClick={() => { setService(s); setResult(null); setResultError(""); }}
                style={{
                  flex: 1, padding: "10px", border: "none", borderRadius: 8,
                  fontSize: 14, fontWeight: 600, cursor: "pointer",
                  background: service === s ? "white" : "transparent",
                  color: service === s ? "#2563eb" : "#64748b",
                  boxShadow: service === s ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
                  transition: "all 0.2s"
                }}>
                {s === "PAN_FETCH" ? "🪪 PAN Verification" : "📋 Aadhaar Verification"}
              </button>
            ))}
          </div>

          {/* Input */}
          {service === "PAN_FETCH" ? (
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, color: "#64748b", marginBottom: 6, fontWeight: 500 }}>
                PAN Number
              </label>
              <input
                value={panInput}
                onChange={e => setPanInput(e.target.value.toUpperCase())}
                maxLength={10}
                placeholder="e.g. CGQPN5366Q"
                style={{
                  width: "100%", padding: "12px 16px",
                  background: "#f8fafc", border: "1px solid #e2e8f0",
                  borderRadius: 10, fontSize: 15, color: "#1e293b",
                  outline: "none", letterSpacing: 1, boxSizing: "border-box"
                }}
              />
            </div>
          ) : (
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, color: "#64748b", marginBottom: 6, fontWeight: 500 }}>
                Aadhaar Number
              </label>
              <input
                value={aadhaarInput}
                onChange={e => setAadhaarInput(e.target.value)}
                maxLength={14}
                placeholder="e.g. 1234 5678 9012"
                style={{
                  width: "100%", padding: "12px 16px",
                  background: "#f8fafc", border: "1px solid #e2e8f0",
                  borderRadius: 10, fontSize: 15, color: "#1e293b",
                  outline: "none", letterSpacing: 1, boxSizing: "border-box"
                }}
              />
            </div>
          )}

          <button onClick={submitKYC} disabled={loading} style={{
            width: "100%", padding: 14, background: "#2563eb",
            color: "white", border: "none", borderRadius: 10,
            fontSize: 15, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1, transition: "all 0.2s"
          }}>
            {loading ? "Verifying..." : "Verify Now"}
          </button>

          {/* Success Result */}
          {result && (
            <div style={{
              marginTop: 20, background: "#f0fdf4",
              border: "1px solid #dcfce7", borderRadius: 12, padding: "24px"
            }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#16a34a", marginBottom: 16 }}>
                ✅ Verification Successful
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                {result.result?.name && (
                  <div>
                    <p style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5 }}>Registered Name</p>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#1e293b", marginTop: 2 }}>{result.result.name}</p>
                  </div>
                )}
                {result.result?.dob && (
                  <div>
                    <p style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5 }}>Date of Birth</p>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#1e293b", marginTop: 2 }}>{result.result.dob}</p>
                  </div>
                )}
                {result.result?.gender && (
                  <div>
                    <p style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5 }}>Gender</p>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#1e293b", marginTop: 2 }}>
                      {result.result.gender === "M" ? "Male" : result.result.gender === "F" ? "Female" : result.result.gender}
                    </p>
                  </div>
                )}
                {result.result?.pan_type && (
                  <div>
                    <p style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5 }}>PAN Type</p>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#1e293b", marginTop: 2 }}>{result.result.pan_type}</p>
                  </div>
                )}
                {result.result?.aadhaar_linked !== undefined && (
                   <div>
                     <p style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5 }}>Aadhaar Linked</p>
                     <p style={{ fontSize: 14, fontWeight: 600, color: "#1e293b", marginTop: 2 }}>
                       {result.result.aadhaar_linked === "1" || result.result.aadhaar_linked === true ? "Yes" : "No"}
                     </p>
                   </div>
                )}
                {result.result?.verified !== undefined && (
                  <div>
                    <p style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5 }}>Status</p>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#16a34a", marginTop: 2 }}>
                      {result.result.verified === true || result.result.verified === "Success" ? "✅ Verified" : "❌ Not Verified"}
                    </p>
                 </div>
                )}
                {result.result?.message && (
                  <div style={{ gridColumn: "1 / -1" }}>
                    <p style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5 }}>Message</p>
                    <p style={{ fontSize: 14, fontWeight: 500, color: "#1e293b", marginTop: 2 }}>{result.result.message}</p>
                  </div>
                )}
              </div>
              <div style={{
                paddingTop: 14, borderTop: "1px solid #dcfce7",
                display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12
              }}>
                <div>
                  <p style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5 }}>Transaction ID</p>
                  <p style={{ fontSize: 12, fontWeight: 500, color: "#64748b", marginTop: 2 }}>
                    {result.transaction_id?.substring(0, 8)}...
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5 }}>Credits Before</p>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#1e293b", marginTop: 2 }}>{result.credits_before}</p>
                </div>
                <div>
                  <p style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5 }}>Credits Remaining</p>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#2563eb", marginTop: 2 }}>{result.credits_remaining}</p>
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {resultError && (
            <div style={{
              marginTop: 20, background: "#fef2f2",
              border: "1px solid #fee2e2", borderRadius: 12, padding: "14px 20px"
            }}>
              <p style={{ fontSize: 14, color: "#ef4444" }}>❌ {resultError}</p>
            </div>
          )}
        </div>

        {/* Logs */}
        <div style={{
          background: "white", borderRadius: 16, padding: 24,
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: "#1e293b" }}>📋 My Transaction History</h3>
            <button onClick={() => loadLogs(apiKey)} style={{
              background: "#f1f5f9", border: "none", borderRadius: 6,
              padding: "6px 12px", fontSize: 12, color: "#64748b", cursor: "pointer"
            }}>🔄 Refresh</button>
          </div>
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
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", color: "#94a3b8", padding: 32 }}>
                    No transactions yet
                  </td>
                </tr>
              ) : logs.map(log => (
                <tr key={log.transaction_id}>
                  <td style={{ padding: "14px 16px", fontSize: 13, color: "#475569" }}>
                    <code style={{
                      background: "#f1f5f9", padding: "2px 6px",
                      borderRadius: 4, fontSize: 11, color: "#2563eb"
                    }}>
                      {log.transaction_id.substring(0, 8)}...
                    </code>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 13, color: "#475569" }}>{log.service}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{
                      padding: "4px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600,
                      background: log.status === "SUCCESS" ? "#f0fdf4" : "#fef2f2",
                      color: log.status === "SUCCESS" ? "#16a34a" : "#ef4444",
                      border: `1px solid ${log.status === "SUCCESS" ? "#dcfce7" : "#fee2e2"}`
                    }}>{log.status}</span>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 13, color: "#475569" }}>{new Date(log.created_at + "Z").toLocaleString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
