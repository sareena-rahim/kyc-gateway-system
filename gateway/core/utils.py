import requests
from datetime import datetime


def generate_transaction_id():
    timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S%f")[:18]
    return f"TXN-{timestamp}"


def build_payload(template, client_data):
    result = {}
    for key, value in template.items():
        if isinstance(value, str) and value.startswith("{") and value.endswith("}"):
            field_name = value[1:-1]
            result[key] = client_data.get(field_name, value)
        else:
            result[key] = value
    return result


def build_headers(template, auth_key=""):
    result = {}
    for key, value in template.items():
        if isinstance(value, str) and "{auth_key}" in value:
            result[key] = value.replace("{auth_key}", auth_key)
        else:
            result[key] = value
    return result


def call_vendor(endpoint_url, http_method, headers, payload):
    try:
        response = requests.request(
            method=http_method.upper(),
            url=endpoint_url,
            headers=headers,
            json=payload,
            timeout=10
        )
        response.raise_for_status()
        return response.json()

    except requests.exceptions.Timeout:
        raise Exception("Vendor request timed out")

    except requests.exceptions.ConnectionError:
        raise Exception("Could not connect to vendor")

    except requests.exceptions.HTTPError as e:
        raise Exception(f"Vendor returned error: {str(e)}")


def mask_aadhaar(value):
    digits = value.replace(" ", "")
    masked = "XXXX XXXX " + digits[-4:]
    return masked


def mask_pan(value):
    masked = value[:2] + "XXX" + value[5:]
    return masked


def mask_payload(payload):
    masked = payload.copy()
    if "aadhaar_number" in masked:
        masked["aadhaar_number"] = mask_aadhaar(masked["aadhaar_number"])
    if "pan_number" in masked:
        masked["pan_number"] = mask_pan(masked["pan_number"])
    return masked