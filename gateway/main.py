from fastapi import FastAPI
from gateway.routers import admin, kyc, balance, logs

app = FastAPI(
    title   = "KYC Gateway",
    version = "1.0.0"
)

app.include_router(admin.router)
app.include_router(kyc.router)
app.include_router(balance.router)
app.include_router(logs.router)

@app.get("/")
def root():
    return {"status": "running", "version": "1.0.0"}
