from fastapi import FastAPI
from app.routers import admin, balance, logs

app = FastAPI(title="KYC Gateway", version="1.0.0")

app.include_router(admin.router)
app.include_router(balance.router)
app.include_router(logs.router)

@app.get("/")
def health_check():
    return {"status": "KYC Gateway is running"}