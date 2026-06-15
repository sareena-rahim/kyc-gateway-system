import httpx
import json
from sqlalchemy.orm import Session
from gateway.models import APIMaster


def get_api_config(service_code: str, db: Session) -> APIMaster:
    """
    Reads the api_master table to get vendor config for the given service.
    """
    config = db.query(APIMaster).filter_by(
        service_code=service_code,
        is_active=True
    ).first()

    if not config:
        raise Exception(f"No active config found for service: {service_code}")

    return config


def fill_template(template: dict, payload: dict) -> dict:
    """
    Fills {{placeholder}} values in the template with actual values.
    Example: {"pancard": "{{pan_number}}"} + {"pan_number": "CGQPN5366Q"}
             = {"pancard": "CGQPN5366Q"}
    """
    filled = {}
    for key, value in template.items():
        if isinstance(value, str) and value.startswith("{{") and value.endswith("}}"):
            placeholder = value[2:-2]  # removes {{ and }}
            filled[key] = payload.get(placeholder, value)
        else:
            filled[key] = value
    return filled


def call_vendor(config: APIMaster, payload: dict) -> dict:
    """
    Builds and sends the HTTP request to the vendor.
    Reads everything from api_master config — nothing hardcoded.
    """
    # Parse templates from database
    headers = json.loads(config.headers_template) if config.headers_template else {}
    payload_template = json.loads(config.payload_template) if config.payload_template else {}

    # Fill placeholders with actual values
    filled_payload = fill_template(payload_template, payload)

    # Make the HTTP request
    with httpx.Client(timeout=30) as client:
        if config.http_method.upper() == "POST":
            response = client.post(
                config.endpoint_url,
                headers=headers,
                json=filled_payload
            )
        elif config.http_method.upper() == "GET":
            response = client.get(
                config.endpoint_url,
                headers=headers,
                params=filled_payload
            )

    return response.json()