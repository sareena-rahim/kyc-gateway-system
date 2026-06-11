from fastapi import HTTPException
from sqlalchemy.orm import Session
from gateway.models import ClientMaster


def authenticate_client(api_key: str, db: Session) -> ClientMaster:
   
    if not api_key:
        raise HTTPException(
            status_code=400,
            detail="client_api_key is required"
        )

    client = db.query(ClientMaster).filter_by(
        api_key=api_key,
        is_active=True
    ).first()

    if not client:
        raise HTTPException(
            status_code=401,
            detail="Invalid or inactive API key"
        )

    return client