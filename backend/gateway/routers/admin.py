from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from gateway.db import get_db
from gateway.models import ClientMaster, ServicesMaster, APIMaster, ClientCredits, ClientCreditsLedger
from gateway.schemas import (
    CreateClientRequest, CreateServiceRequest, CreateAPIConfigRequest,
    TopupRequest, ClientResponse, ServiceResponse, TopupResponse
)
import json
import secrets

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.post("/clients", response_model=ClientResponse)
def create_client(request: CreateClientRequest, db: Session = Depends(get_db)):
    existing = db.query(ClientMaster).filter_by(username=request.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")

    # Auto generate API key
    api_key = request.api_key or secrets.token_hex(16)

    import hashlib
    password_hash = hashlib.sha256(request.password.encode()).hexdigest()

    client = ClientMaster(
    name=request.name,
    username=request.username,
    password_hash=password_hash,
    api_key=api_key,
    subscription_plan=request.subscription_plan
)
    db.add(client)
    db.commit()
    db.refresh(client)

    credits = ClientCredits(client_id=client.id, balance=0)
    db.add(credits)
    db.commit()

    return client


@router.post("/services", response_model=ServiceResponse)
def create_service(request: CreateServiceRequest, db: Session = Depends(get_db)):
    existing = db.query(ServicesMaster).filter_by(service_code=request.service_code).first()
    if existing:
        raise HTTPException(status_code=400, detail="Service already exists")

    service = ServicesMaster(
        service_code=request.service_code,
        display_name=request.display_name
    )
    db.add(service)
    db.commit()
    db.refresh(service)

    return service


@router.post("/api-config")
def create_api_config(request: CreateAPIConfigRequest, db: Session = Depends(get_db)):
    config = APIMaster(
        service_code=request.service_code,
        vendor_name=request.vendor_name,
        endpoint_url=request.endpoint_url,
        http_method=request.http_method,
        headers_template=json.dumps(request.headers_template),
        payload_template=json.dumps(request.payload_template),
        response_map=json.dumps(request.response_map)
    )
    db.add(config)
    db.commit()
    db.refresh(config)

    return {"message": "API config created successfully", "id": config.id}


@router.post("/clients/topup", response_model=TopupResponse)
def topup_credits(request: TopupRequest, db: Session = Depends(get_db)):
    client = db.query(ClientMaster).filter_by(api_key=request.api_key, is_active=True).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    credits = db.query(ClientCredits).filter_by(client_id=client.id).first()
    if not credits:
        raise HTTPException(status_code=404, detail="Credits record not found")

    credits.balance += request.amount

    ledger = ClientCreditsLedger(
        client_id=client.id,
        transaction_type="TOPUP",
        amount=request.amount,
        balance_after=credits.balance,
        reference_txn_id=secrets.token_hex(8)
    )
    db.add(ledger)
    db.commit()

    return TopupResponse(
        client=client.name,
        amount=request.amount,
        new_balance=credits.balance
    )


@router.get("/clients")
def get_all_clients(db: Session = Depends(get_db)):
    clients = db.query(ClientMaster).all()
    result = []
    for client in clients:
        credits = db.query(ClientCredits).filter_by(client_id=client.id).first()
        result.append({
    "id": client.id,
    "name": client.name,
    "username": client.username,
    "api_key": client.api_key,
    "is_active": client.is_active,
    "subscription_plan": client.subscription_plan,
    "balance": credits.balance if credits else 0
})
    return result

@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    total_clients = db.query(ClientMaster).count()
    total_services = db.query(ServicesMaster).count()
    total_credits_used = db.query(ClientCreditsLedger).count()
    return {
        "total_clients": total_clients,
        "total_services": total_services,
        "total_credits_used": total_credits_used
    }

@router.post("/clients/{client_id}/regenerate-key")
def regenerate_key(client_id: int, db: Session = Depends(get_db)):
    client = db.query(ClientMaster).filter_by(id=client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    client.api_key = secrets.token_hex(16)
    db.commit()
    return {"new_api_key": client.api_key}

@router.post("/clients/{client_id}/revoke-key")
def revoke_key(client_id: int, db: Session = Depends(get_db)):
    client = db.query(ClientMaster).filter_by(id=client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    client.is_active = False
    db.commit()
    return {"success": True}