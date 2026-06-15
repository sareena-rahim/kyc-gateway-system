from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from gateway.db import get_db
from gateway import auth
from gateway.models import ClientCredits
from gateway.schemas import BalanceResponse

router = APIRouter(prefix="/api/kyc", tags=["Balance"])

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