import { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "http://127.0.0.1:8001";

const PLANS = [
  {
    id: "BASIC",
    name: "Basic",
    credits: 100,
    price: "₹199",
    period: "month",
    features: ["100 KYC verifications", "PAN & Aadhaar support", "Transaction logs", "Email support"],
    color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe"
  },
  {
    id: "STANDARD",
    name: "Standard",
    credits: 500,
    price: "₹599",
    period: "month",
    features: ["500 KYC verifications", "PAN & Aadhaar support", "Transaction logs", "Priority support", "Bulk verification"],
    color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe", popular: true
  },
  {
    id: "PREMIUM",
    name: "Premium",
    credits: 2000,
    price: "₹1,499",
    period: "month",
    features: ["2000 KYC verifications", "PAN & Aadhaar support", "Transaction logs", "24/7 support", "Bulk verification", "Dedicated account manager"],
    color: "#059669", bg: "#f0fdf4", border: "#bbf7d0"
  }
];

export default function SubscriptionPage() {
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [checkingStatus, setCheckingStatus] = useState(true);

  const params = new URLSearchParams(window.location.search);
  const apiKey = params.get("api_key") || "";
  const clientName = params.get("name") || "Client";

  useEffect(() => {
    if (apiKey) {
      checkSubscription();
    }
  }, []);

  async function checkSubscription() {
    try {
      const res = await axios.get(`${BASE_URL}/api/kyc/subscription?client_api_key=${apiKey}`);
      setIsSubscribed(res.data.is_subscribed);
      setCurrentPlan(res.data.subscription_plan);
    } catch (e) {
      console.error(e);
    } finally {
      setCheckingStatus(false);
    }
  }

  async function subscribe(planId) {
    setLoading(planId);
    setError("");
    setSuccess("");

    try {
      await axios.post(`${BASE_URL}/api/kyc/subscribe`, {
        client_api_key: apiKey,
        plan: planId
      });
      setSuccess(`✅ Successfully subscribed to ${planId} plan! Admin will add your credits shortly.`);
      setTimeout(() => {
        window.location.href = `/dashboard?api_key=${apiKey}`;
      }, 2000);
    } catch (e) {
      setError(e.response?.data?.detail || "Something went wrong!");
    } finally {
      setLoading(null);
    }
  }

  if (checkingStatus) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#eef2ff" }}>
        <p style={{ color: "#64748b" }}>Loading...</p>
      </div>
    );
  }

  if (isSubscribed) {
    return (
      <div style={{ fontFamily: "'Segoe UI', sans-serif", background: "#eef2ff", minHeight: "100vh" }}>
        <nav style={{
          background: "white", padding: "16px 32px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderBottom: "1px solid #e2e8f0", boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, background: "#2563eb", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🛡️</div>
            <span style={{ fontWeight: 700, fontSize: 16 }}>KYC Gateway</span>
          </div>
          <button onClick={() => window.location.href = `/dashboard?api_key=${apiKey}`} style={{
            background: "#2563eb", color: "white", border: "none",
            borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer"
          }}>← Dashboard</button>
        </nav>
        <div style={{ maxWidth: 500, margin: "80px auto", padding: 32, textAlign: "center" }}>
          <div style={{ background: "white", borderRadius: 20, padding: 48, boxShadow: "0 4px 16px rgba(0,0,0,0.08)", border: "1px solid #f1f5f9" }}>
            <div style={{ fontSize: 56, marginBottom: 20 }}>✅</div>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: "#1e293b", marginBottom: 12 }}>Already Subscribed!</h2>
            <p style={{ color: "#64748b", fontSize: 15, lineHeight: 1.6, marginBottom: 8 }}>You are currently on the</p>
            <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 10, padding: "12px 24px", marginBottom: 32, display: "inline-block" }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: "#2563eb" }}>{currentPlan} Plan</span>
            </div>
            <br />
            <button onClick={() => window.location.href = `/dashboard?api_key=${apiKey}`} style={{
              padding: "14px 32px", background: "#2563eb", color: "white",
              border: "none", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer"
            }}>Go to Dashboard →</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: "#eef2ff", minHeight: "100vh" }}>
      <nav style={{
        background: "white", padding: "16px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: "1px solid #e2e8f0", boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, background: "#2563eb", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🛡️</div>
          <span style={{ fontWeight: 700, fontSize: 16 }}>KYC Gateway</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 13, color: "#64748b" }}>Welcome, <strong style={{ color: "#1e293b" }}>{clientName}</strong></span>
          <button onClick={() => window.location.href = `/dashboard?api_key=${apiKey}`} style={{
            background: "#2563eb", color: "white", border: "none",
            borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer"
          }}>← Dashboard</button>
        </div>
      </nav>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: 40 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#1e293b", marginBottom: 8 }}>Choose Your Plan</h2>
          <p style={{ color: "#64748b", fontSize: 15 }}>Subscribe to start verifying PAN & Aadhaar numbers</p>
        </div>

        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fee2e2", borderRadius: 10, padding: "12px 20px", marginBottom: 24, color: "#ef4444", fontSize: 14, textAlign: "center" }}>
            ❌ {error}
          </div>
        )}

        {success && (
          <div style={{ background: "#f0fdf4", border: "1px solid #dcfce7", borderRadius: 10, padding: "12px 20px", marginBottom: 24, color: "#16a34a", fontSize: 14, textAlign: "center" }}>
            {success}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {PLANS.map(plan => (
            <div key={plan.id} style={{
              background: "white", borderRadius: 16, padding: 28,
              border: plan.popular ? `2px solid ${plan.color}` : "1px solid #e2e8f0",
              boxShadow: plan.popular ? "0 8px 24px rgba(0,0,0,0.1)" : "0 1px 4px rgba(0,0,0,0.06)",
              position: "relative"
            }}>
              {plan.popular && (
                <div style={{
                  position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                  background: plan.color, color: "white", padding: "4px 16px",
                  borderRadius: 999, fontSize: 12, fontWeight: 600
                }}>Most Popular</div>
              )}
              <div style={{ background: plan.bg, border: `1px solid ${plan.border}`, borderRadius: 10, padding: "16px 20px", marginBottom: 20 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: plan.color, marginBottom: 4 }}>{plan.name}</h3>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                  <span style={{ fontSize: 28, fontWeight: 800, color: "#1e293b" }}>{plan.price}</span>
                  <span style={{ fontSize: 13, color: "#64748b" }}>/{plan.period}</span>
                </div>
                <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>{plan.credits} KYC credits included</p>
              </div>
              <ul style={{ listStyle: "none", marginBottom: 24 }}>
                {plan.features.map((f, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#475569", marginBottom: 10 }}>
                    <span style={{ color: plan.color, fontWeight: 700 }}>✓</span>{f}
                  </li>
                ))}
              </ul>
              <button onClick={() => subscribe(plan.id)} disabled={loading === plan.id} style={{
                width: "100%", padding: "12px",
                background: plan.popular ? plan.color : "white",
                color: plan.popular ? "white" : plan.color,
                border: `2px solid ${plan.color}`, borderRadius: 10,
                fontSize: 14, fontWeight: 600,
                cursor: loading === plan.id ? "not-allowed" : "pointer",
                opacity: loading === plan.id ? 0.6 : 1
              }}>
                {loading === plan.id ? "Subscribing..." : `Subscribe to ${plan.name}`}
              </button>
            </div>
          ))}
        </div>
        <p style={{ textAlign: "center", color: "#94a3b8", fontSize: 13, marginTop: 32 }}>
          💡 After subscribing, the admin will add your credits. You'll be notified once credits are available.
        </p>
      </div>
    </div>
  );
}