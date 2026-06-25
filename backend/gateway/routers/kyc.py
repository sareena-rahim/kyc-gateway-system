from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from gateway.db import get_db
from gateway.auth import authenticate_client
from gateway.models import ServicesMaster
from gateway.schemas import KYCRequest, KYCResponse
from gateway.core.service import process_kyc_request

router = APIRouter(prefix="/api/kyc", tags=["KYC"])


@router.post("/request", response_model=KYCResponse)
def kyc_request(body: KYCRequest, db: Session = Depends(get_db)):

    # Step 1: Authenticate client
    client = authenticate_client(body.client_api_key, db)

    # Step 2: Validate service exists
    service = db.query(ServicesMaster).filter_by(
        service_code = body.service_code,
        is_active    = True
    ).first()

    if not service:
        raise HTTPException(
            status_code = 400,
            detail      = f"Unknown or inactive service: {body.service_code}"
        )

    # Step 3: Process (credits + vendor + normalize + log)
    return process_kyc_request(
        client       = client,
        service_code = body.service_code,
        payload      = body.payload,
        db           = db
    )