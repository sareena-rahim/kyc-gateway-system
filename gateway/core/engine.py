# gateway/core/engine.py

import json
import os
import httpx
from fastapi import HTTPException
from dotenv import load_dotenv

load_dotenv()


def fill_template(template: dict, client_payload: dict) -> dict:

    filled = {}
    for key, value in template.items():
        if isinstance(value, str) and "{{" in value:
            field_name = value.replace("{{", "").replace("}}", "").strip()
            filled[key] = client_payload.get(field_name)
        else:
            filled[key] = value
    return filled


def fill_headers(headers_template: dict) -> dict:

    filled = {}
    for key, value in headers_template.items():
        if isinstance(value, str) and "{{" in value:
            env_key = value.replace("{{", "").replace("}}", "").strip()
            filled[key] = os.getenv(env_key, value)
        else:
            filled[key] = value
    return filled


def build_and_call_vendor(api_config, client_payload: dict):


    # Build headers
    headers = {}
    if api_config.headers_template:
        try:
            headers_template = json.loads(api_config.headers_template)
            headers = fill_headers(headers_template)
        except json.JSONDecodeError:
            raise HTTPException(
                500,
                "Invalid headers_template in api_master"
            )

    # Build payload
    try:
        template = json.loads(api_config.payload_template)
    except json.JSONDecodeError:
        raise HTTPException(
            500,
            "Invalid payload_template in api_master"
        )

    vendor_request_body = fill_template(template, client_payload)

    # Call vendor
    try:
        response = httpx.post(
            api_config.endpoint_url,
            json    = vendor_request_body,
            headers = headers,
            timeout = 10.0
        )
    except httpx.TimeoutException:
        raise HTTPException(504, "Vendor request timed out")
    except httpx.RequestError:
        raise HTTPException(502, "Could not reach vendor")

    return vendor_request_body, response.json()
