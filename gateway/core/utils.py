import json
import uuid
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