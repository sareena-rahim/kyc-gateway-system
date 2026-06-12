from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from gateway.db import get_db
from gateway import auth
from gateway.models import AuditLog
from gateway.schemas import LogsResponse, LogEntry

router = APIRouter(prefix="/api/kyc", tags=["Logs"])

@router.get("/logs", response_model=LogsResponse)
def get_logs(client_api_key: str, db: Session = Depends(get_db)):
    client = auth.authenticate_client(client_api_key, db)

    logs = db.query(AuditLog).filter_by(client_id=client.id).all()

    log_entries = [
        LogEntry(
            transaction_id=log.transaction_id,
            service=log.service_code,
            status=log.status,
            created_at=str(log.created_at)
        )
        for log in logs
    ]

    return LogsResponse(
        client=client.name,
        total=len(log_entries),
        logs=log_entries
    )