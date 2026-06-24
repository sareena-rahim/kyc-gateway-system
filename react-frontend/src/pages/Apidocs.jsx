import { useState } from "react";

export default function ApiDocs() {
  const [copied, setCopied] = useState("");

  const params = new URLSearchParams(window.location.search);
  const apiKey = params.get("api_key") || "YOUR_API_KEY";
  const BASE_URL = "http://127.0.0.1:8001";

  function copy(text, id) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(""), 2000);
    });
  }

  const CodeBlock = ({ id, code }) => (
    <div style={{ position: "relative", marginTop: 8 }}>
      <pre style={{
        background: "#0f172a", color: "#e2e8f0", borderRadius: 10,
        padding: "16px 20px", fontSize: 13, overflowX: "auto",
        fontFamily: "monospace", lineHeight: 1.6, margin: 0
      }}>{code}</pre>
      <button
        onClick={() => copy(code, id)}
        style={{
          position: "absolute", top: 8, right: 8,
          background: copied === id ? "#16a34a" : "#334155",
          color: "white", border: "none", borderRadius: 6,
          padding: "4px 10px", fontSize: 11, cursor: "pointer", fontWeight: 600
        }}
      >
        {copied === id ? "✅ Copied!" : "Copy"}
      </button>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: "#eef2ff", minHeight: "100vh" }}>

      {/* Navbar */}
      <nav style={{
        background: "white", padding: "16px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: "1px solid #e2e8f0", boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, background: "#2563eb", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🛡️</div>
          <span style={{ fontWeight: 700, fontSize: 16 }}>KYC Gateway</span>
        </div>
        <button onClick={() => window.history.back()} style={{
          background: "#2563eb", color: "white", border: "none",
          borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer"
        }}>← Back</button>
      </nav>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: 32 }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: "#1e293b", marginBottom: 8 }}>
            📖 API Documentation
          </h2>
          <p style={{ color: "#64748b", fontSize: 15 }}>
            Use these endpoints to integrate KYC verification into your system via Postman or any HTTP client.
          </p>
        </div>

        {/* Base URL */}
        <div style={{ background: "white", borderRadius: 16, padding: 24, marginBottom: 20, border: "1px solid #f1f5f9", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: "#1e293b", marginBottom: 12 }}>🌐 Base URL</h3>
          <CodeBlock id="baseurl" code={BASE_URL} />
        </div>

        {/* Authentication */}
        <div style={{ background: "white", borderRadius: 16, padding: 24, marginBottom: 20, border: "1px solid #f1f5f9", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: "#1e293b", marginBottom: 8 }}>🔑 Authentication</h3>
          <p style={{ color: "#64748b", fontSize: 14, marginBottom: 12 }}>
            All requests require your <strong>API Key</strong> in the request body as <code style={{ background: "#f1f5f9", padding: "2px 6px", borderRadius: 4, fontSize: 12 }}>client_api_key</code>.
          </p>
          <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 10, padding: "12px 16px" }}>
            <p style={{ fontSize: 13, color: "#1e40af", margin: 0 }}>
              🔐 Your API Key: <strong style={{ fontFamily: "monospace" }}>{apiKey}</strong>
            </p>
          </div>
        </div>

        {/* Endpoint 1 - KYC Request */}
        <div style={{ background: "white", borderRadius: 16, padding: 24, marginBottom: 20, border: "1px solid #f1f5f9", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <span style={{ background: "#2563eb", color: "white", padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 700 }}>POST</span>
            <code style={{ fontSize: 14, color: "#1e293b", fontFamily: "monospace" }}>/api/kyc/request</code>
          </div>
          <p style={{ color: "#64748b", fontSize: 14, marginBottom: 16 }}>
            Submit a PAN or Aadhaar number for verification. Deducts 1 credit per request.
          </p>

          <p style={{ fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 4 }}>PAN Verification Request:</p>
        <CodeBlock id="pan-req" code={`{
  "client_api_key": "${apiKey}",
  "service_code": "PAN_FETCH",
  "payload": {
    "pan_number": "CGQPN5366Q"
  }
}`} />

          <p style={{ fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 4, marginTop: 16 }}>Aadhaar Verification Request:</p>
          <CodeBlock id="aadhaar-req" code={`{
  "client_api_key": "${apiKey}",
  "service_code": "AADHAAR_VERIFY",
  "payload": {
    "aadhaar_number": "1234 5678 9012"
  }
}`} />

          <p style={{ fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 4, marginTop: 16 }}>Response:</p>
     <CodeBlock id="kyc-res" code={`{
  "transaction_id": "16af84f9-6bc2-43df-bbc1-d79d99ed9c24",
  "status": "SUCCESS",
  "service": "PAN_FETCH",
  "client": "Your Bank Name",
  "credits_before": 100,
  "credits_remaining": 99,
  "result": {
    "verified": true,
    "name": "RAHUL SHARMA",
    "dob": "15-05-1990",
    "message": "PAN verified successfully",
    "gender": "Male",
    "pan_type": "Individual or Person",
    "aadhaar_linked": "1"
  }
}`} />
        </div>

        {/* Endpoint 2 - Balance */}
        <div style={{ background: "white", borderRadius: 16, padding: 24, marginBottom: 20, border: "1px solid #f1f5f9", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <span style={{ background: "#16a34a", color: "white", padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 700 }}>GET</span>
            <code style={{ fontSize: 14, color: "#1e293b", fontFamily: "monospace" }}>/api/kyc/balance</code>
          </div>
          <p style={{ color: "#64748b", fontSize: 14, marginBottom: 16 }}>Check your remaining credit balance.</p>

          <p style={{ fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 4 }}>Request URL:</p>
          <CodeBlock id="balance-req" code={`${BASE_URL}/api/kyc/balance?client_api_key=${apiKey}`} />

          <p style={{ fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 4, marginTop: 16 }}>Response:</p>
          <CodeBlock id="balance-res" code={`{
  "client": "Your Bank Name",
  "balance": 99
}`} />
        </div>

        {/* Endpoint 3 - Logs */}
        <div style={{ background: "white", borderRadius: 16, padding: 24, marginBottom: 20, border: "1px solid #f1f5f9", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <span style={{ background: "#16a34a", color: "white", padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 700 }}>GET</span>
            <code style={{ fontSize: 14, color: "#1e293b", fontFamily: "monospace" }}>/api/kyc/logs</code>
          </div>
          <p style={{ color: "#64748b", fontSize: 14, marginBottom: 16 }}>View all your transaction history.</p>

          <p style={{ fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 4 }}>Request URL:</p>
          <CodeBlock id="logs-req" code={`${BASE_URL}/api/kyc/logs?client_api_key=${apiKey}`} />

          <p style={{ fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 4, marginTop: 16 }}>Response:</p>
          <CodeBlock id="logs-res" code={`{
  "client": "Your Bank Name",
  "total": 5,
  "logs": [
    {
      "transaction_id": "abc-123",
      "service": "PAN_FETCH",
      "status": "SUCCESS",
      "created_at": "2026-06-22 08:47:27"
    }
  ]
}`} />
        </div>

        {/* Error Codes */}
        <div style={{ background: "white", borderRadius: 16, padding: 24, marginBottom: 20, border: "1px solid #f1f5f9", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: "#1e293b", marginBottom: 16 }}>⚠️ Error Codes</h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Code", "Meaning", "Solution"].map(h => (
                  <th key={h} style={{ textAlign: "left", fontSize: 12, color: "#94a3b8", padding: "10px 16px", borderBottom: "1px solid #f1f5f9", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["400", "Bad Request", "Check your request body format"],
                ["401", "Invalid API Key", "Make sure your API key is correct"],
                ["402", "Insufficient Credits", "Contact admin to topup credits"],
                ["404", "Service Not Found", "Check the service_code value"],
                ["500", "Server Error", "Contact support"]
              ].map(([code, meaning, solution]) => (
                <tr key={code}>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ background: "#fef2f2", color: "#ef4444", padding: "3px 8px", borderRadius: 4, fontSize: 12, fontWeight: 600 }}>{code}</span>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#475569" }}>{meaning}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#64748b" }}>{solution}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}