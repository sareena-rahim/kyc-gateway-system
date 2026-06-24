import json
import uuid
from datetime import datetime, timezone
from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session



from gateway.models import (
    ClientCredits,
    ClientCreditsLedger,
    APIMaster,
    AuditLog
)
from gateway.core.engine import build_and_call_vendor
from gateway.core.normalizer import normalize_response
from gateway.core.utils import mask_payload


def process_kyc_request(client, service_code: str, payload: dict, db: Session):

    txn_id = str(uuid.uuid4())
    order_id = txn_id.replace("-", "")[:20]
    masked = mask_payload(payload)

    # Status is INITIATED.
    # Even if everything crashes after this,
    # we have a record that the request happened.
    audit = AuditLog(
        transaction_id  = txn_id,
        client_id       = client.id,
        service_code    = service_code,
        inbound_payload = json.dumps(masked),
        status          = "INITIATED"
    )
    db.add(audit)
    db.commit()

    try:
        # with_for_update() = SELECT FOR UPDATE
        # Locks this row until we commit.
        # Any concurrent request waits here
        # until we release the lock.
        credits = db.execute(
            select(ClientCredits)
            .where(ClientCredits.client_id == client.id)
            .with_for_update()
        ).scalar_one_or_none()

        if not credits:
            raise HTTPException(402, "No credit account found for this client")

        if credits.balance < 1:
            raise HTTPException(402, "Insufficient credits")

        balance_before = credits.balance

        api_config = db.query(APIMaster).filter_by(
            service_code = service_code,
            is_active    = True
        ).first()

        if not api_config:
            raise HTTPException(
                400,
                f"No active vendor configured for service: {service_code}"
            )

        enriched_payload = {
            **payload,
            "order_id": order_id 
        }
        vendor_request, vendor_response = build_and_call_vendor(
            api_config, enriched_payload
        )

        try:
            field_map = json.loads(api_config.response_map)
        except json.JSONDecodeError:
            raise HTTPException(500, "Invalid response_map in api_master")

        normalized = normalize_response(vendor_response, field_map)
        print("Done")

        credits.balance -= 1

        db.add(ClientCreditsLedger(
            client_id        = client.id,
            transaction_type = "DEBIT",
            amount           = -1,
            balance_after    = credits.balance,
            reference_txn_id = txn_id
        ))

        audit.vendor_request      = json.dumps(vendor_request)
        audit.vendor_response     = json.dumps(vendor_response)
        audit.normalized_response = json.dumps(normalized)
        audit.status              = "SUCCESS"

        # Credit deduction + ledger entry + audit log update
        # all succeed together or all fail together.
        db.commit()

        return {
            "transaction_id":    txn_id,
            "status":            "SUCCESS",
            "service":           service_code,
            "client":            client.name,
            "credits_before":    balance_before,
            "credits_remaining": credits.balance,
            "result":            normalized

        }
        print(f'Normalized Response:',Normalized)

    except HTTPException as e:
        audit.status = "FAILED"
        db.commit()
        raise

    except Exception as e:
        audit.status = "FAILED"
        db.commit()
        raise HTTPException(500, f"Unexpected error: {str(e)}")