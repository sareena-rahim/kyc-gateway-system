from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db

router = APIRouter(prefix="/api/kyc", tags=["Balance"])

@router.get("/balance")
def get_balance(client_api_key: str, db: Session = Depends(get_db)):
    # TODO: plug in Sareena's auth.py and models here
    # client = auth.validate_client(client_api_key, db)
    # balance = models.get_client_balance(client.id, db)
    return {
        "client_api_key": client_api_key,
        "balance": 100,
        "message": "Credit balance fetched successfully"
    }