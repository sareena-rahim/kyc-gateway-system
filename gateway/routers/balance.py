from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from gateway.db import get_db
from gateway import auth
from gateway.models import ClientCredits, ClientMaster
from gateway.schemas import BalanceResponse
from pydantic import BaseModel

router = APIRouter(prefix="/api/kyc", tags=["Balance"])

# Subscription plans
PLANS = {
    "BASIC": 100,
    "STANDARD": 500,
    "PREMIUM": 2000
}

class SubscribeRequest(BaseModel):
    client_api_key: str
    plan: str  # BASIC, STANDARD, PREMIUM

@router.get("/balance", response_model=BalanceResponse)
def get_balance(client_api_key: str, db: Session = Depends(get_db)):
    client = auth.authenticate_client(client_api_key, db)
    
    credits = db.query(ClientCredits).filter_by(client_id=client.id).first()
    
    if not credits:
        raise HTTPException(status_code=404, detail="No credits record found for this client")
    
    return BalanceResponse(
        client=client.name,
        balance=credits.balance
    )


@router.get("/subscription")
def get_subscription(client_api_key: str, db: Session = Depends(get_db)):
    client = auth.authenticate_client(client_api_key, db)
    
    return {
        "client": client.name,
        "is_subscribed": client.is_subscribed,
        "subscription_plan": client.subscription_plan
    }


@router.post("/subscribe")
def subscribe(request: SubscribeRequest, db: Session = Depends(get_db)):
    client = auth.authenticate_client(request.client_api_key, db)

    if request.plan.upper() not in PLANS:
        raise HTTPException(status_code=400, detail=f"Invalid plan. Choose from: {list(PLANS.keys())}")

    if client.is_subscribed:
        raise HTTPException(status_code=400, detail=f"Already subscribed to {client.subscription_plan} plan")

    client.is_subscribed = True
    client.subscription_plan = request.plan.upper()
    db.commit()

    return {
        "message": f"Successfully subscribed to {request.plan.upper()} plan!",
        "client": client.name,
        "plan": request.plan.upper(),
        "credits_will_be_added": PLANS[request.plan.upper()]
    }
