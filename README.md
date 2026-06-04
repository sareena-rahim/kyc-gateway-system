# KYC Gateway System

## 📌 Overview
This project is a unified KYC (Know Your Customer) middleware gateway that standardizes multiple KYC vendor APIs (like PAN and Aadhaar verification) into a single API interface.

Instead of integrating multiple vendors separately, clients can call one API and the system will:
- Route the request to the correct vendor dynamically
- Normalize different vendor response formats
- Deduct client credits
- Maintain audit logs for every transaction

---

## 🏗️ System Architecture

Client (Postman)
↓
Gateway API (FastAPI)
↓
API Master (routing config)
↓
Mock Vendor API (simulated KYC provider)
↓
Response Normalizer
↓
Credit Ledger + Audit Logs

---

## ⚙️ Tech Stack
- Python 3.10+
- FastAPI
- Requests library
- PostgreSQL (future phase)
- Git + GitHub

---

## 🚀 How to Run the Project

### 1. Clone the repository
```bash
git clone <repo-url>
cd kyc-gateway-system