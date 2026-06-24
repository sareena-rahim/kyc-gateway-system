import { useEffect, useState } from "react";
import axios from "axios";
export default function Profile() {
  const [clientName, setClientName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [plan, setPlan] = useState("");
  const [balance, setBalance] = useState("");
  const BASE_URL = "http://127.0.0.1:8001";

  useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const key = params.get("api_key") || "";

  setApiKey(key);

  if (key) {
    loadProfile(key);
  }
}, []);

  async function loadProfile(key) {
   try {
    const balanceRes = await axios.get(
      `${BASE_URL}/api/kyc/balance?client_api_key=${key}`
    );

    setClientName(balanceRes.data.client);
    setBalance(balanceRes.data.balance);

    const subRes = await axios.get(
      `${BASE_URL}/api/kyc/subscription?client_api_key=${key}`
    );

    setPlan(subRes.data.subscription_plan || "No Plan");
       } catch (err) {
    console.error("Profile load failed:", err);
    }
   }
  return (
    <div
      style={{
        fontFamily: "'Segoe UI', sans-serif",
        background: "#eef2ff",
        minHeight: "100vh"
      }}
    >
      {/* Navbar */}
      <nav
        style={{
          background: "white",
          padding: "16px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #e2e8f0",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              background: "#2563eb",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18
            }}
          >
            🛡️
          </div>

          <span
            style={{
              fontWeight: 700,
              fontSize: 16
            }}
          >
            KYC Gateway
          </span>
        </div>

        <button
          onClick={() => window.history.back()}
          style={{
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: 8,
            padding: "10px 18px",
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 600
          }}
        >
          Dashboard
        </button>
      </nav>

      {/* Main Container */}
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: 32
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h2
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#1e293b",
              marginBottom: 4
            }}
          >
            👤 Client Profile
          </h2>

          <p
            style={{
              color: "#94a3b8",
              fontSize: 14
            }}
          >
            View your account and subscription information
          </p>
        </div>

        {/* Profile Card */}
        <div
          style={{
            background: "white",
            borderRadius: 16,
            padding: 32,
            border: "1px solid #f1f5f9",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
          }}
        >
          <h3
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: "#1e293b",
              marginBottom: 24
            }}
          >
            Account Information
          </h3>

          {/* Company Name */}
          <div style={{ marginBottom: 20 }}>
            <p
              style={{
                fontSize: 12,
                color: "#64748b",
                marginBottom: 4,
                fontWeight: 500
              }}
            >
              COMPANY NAME
            </p>

            <p
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#1e293b",
                margin: 0
              }}
            >
              {clientName}
            </p>
          </div>

          {/* API Key */}
          <div style={{ marginBottom: 20 }}>
            <p
              style={{
                fontSize: 12,
                color: "#64748b",
                marginBottom: 4,
                fontWeight: 500
              }}
            >
              API KEY
            </p>

            <p
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#1e293b",
                wordBreak: "break-all",
                margin: 0
              }}
            >
              {apiKey}
            </p>
          </div>

          {/* Plan */}
          <div style={{ marginBottom: 20 }}>
            <p
              style={{
                fontSize: 12,
                color: "#64748b",
                marginBottom: 4,
                fontWeight: 500
              }}
            >
              CURRENT PLAN
            </p>

            <p
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#1e293b",
                margin: 0
              }}
            >
              {plan}
            </p>
          </div>

          {/* Balance */}
          <div style={{ marginBottom: 30 }}>
            <p
              style={{
                fontSize: 12,
                color: "#64748b",
                marginBottom: 4,
                fontWeight: 500
              }}
            >
              AVAILABLE CREDITS
            </p>

            <p
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#2563eb",
                margin: 0
              }}
            >
              {balance}
            </p>
          </div>

          {/* Buttons */}
          <div
            style={{
              display: "flex",
              gap: 12
            }}
          >
            <button
              onClick={() => {
              navigator.clipboard.writeText(apiKey)
              .then(() => alert("API Key copied!"))
              .catch(() => {
      // Fallback for browsers that block clipboard
              const el = document.createElement("textarea");
              el.value = apiKey;
              document.body.appendChild(el);
              el.select();
              document.execCommand("copy");
              document.body.removeChild(el);
              alert("API Key copied!");
      });
}} >
              📋 Copy API Key
            </button>

            <button
              onClick={() => window.history.back()}
              style={{
                background: "#f1f5f9",
                color: "#475569",
                border: "none",
                borderRadius: 10,
                padding: "12px 20px",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              ← Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}