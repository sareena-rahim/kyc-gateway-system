from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from pydantic import BaseModel

router = APIRouter(prefix="/admin", tags=["Admin"])

# ─── Request Schemas ───────────────────────────────────────────

class CreateClientRequest(BaseModel):
    name: str
    email: str

class CreateServiceRequest(BaseModel):
    service_code: str        # e.g. PAN_FETCH, AADHAAR_VERIFY
    description: str

class CreateAPIConfigRequest(BaseModel):
    service_code: str
    vendor_name: str
    endpoint_url: str
    http_method: str
    payload_template: dict
    response_map: dict
    auth_header_key: str
    auth_header_value: str

class TopupRequest(BaseModel):
    client_api_key: str
    amount: int              # number of credits to add

# ─── Routes ────────────────────────────────────────────────────

@router.post("/clients")
def create_client(request: CreateClientRequest, db: Session = Depends(get_db)):
    # TODO: plug in Sareena's model here
    return {
        "message": "Client created successfully",
        "name": request.name,
        "email": request.email
    }


@router.post("/services")
def create_service(request: CreateServiceRequest, db: Session = Depends(get_db)):
    # TODO: plug in Sareena's model here
    return {
        "message": "Service created successfully",
        "service_code": request.service_code,
        "description": request.description
    }


@router.post("/api-config")
def create_api_config(request: CreateAPIConfigRequest, db: Session = Depends(get_db)):
    # TODO: plug in Sareena's model here
    return {
        "message": "API config created successfully",
        "service_code": request.service_code,
        "vendor_name": request.vendor_name,
        "endpoint_url": request.endpoint_url
    }


@router.post("/clients/topup")
def topup_credits(request: TopupRequest, db: Session = Depends(get_db)):
    # TODO: plug in Sareena's model here
    return {
        "message": "Credits added successfully",
        "client_api_key": request.client_api_key,
        "credits_added": request.amount
    }