def normalize_response(vendor_response, response_map):
    result = {}
    for standard_key, vendor_key in response_map.items():
        result[standard_key] = vendor_response.get(vendor_key)
    return result


def parse_verified_flag(normalized):
    status_value = normalized.get("verified")

    if isinstance(status_value, bool):
        return normalized

    if isinstance(status_value, str):
        normalized["verified"] = status_value.upper() in (
            "VALID", "ACTIVE", "TRUE", "YES", "SUCCESS", "1"
        )

    return normalized