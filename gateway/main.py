from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from gateway.routers import admin, kyc, balance, logs

app = FastAPI(title="KYC Gateway", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/ui", StaticFiles(directory="templates", html=True), name="ui")

app.include_router(admin.router)
app.include_router(kyc.router)
app.include_router(balance.router)
app.include_router(logs.router)

@app.get("/")
def root():
    return {"status": "running", "version": "1.0.0"}