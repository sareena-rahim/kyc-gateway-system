# gateway/core/normalizer.py

def get_value_by_path(data: dict, path: str):
    for key in path.split("."):
        if isinstance(data, dict):
            data = data.get(key)
        else:
            return None
    return data


def normalize_response(raw_vendor_response: dict, response_map: dict) -> dict:
    normalized = {}
    for our_field, vendor_path in response_map.items():
        value = get_value_by_path(raw_vendor_response, vendor_path)

        if our_field == "verified" and isinstance(value, str):
            value = value.upper() in (
                "VALID", "ACTIVE", "TRUE", "YES", "SUCCESS", "1"
            )

        normalized[our_field] = value
    return normalized