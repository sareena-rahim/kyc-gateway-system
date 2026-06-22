# gateway/core/normalizer.py

def get_value_by_path(data: dict, path: str):
    for key in path.split("."):
        if isinstance(data, dict):
            data = data.get(key)
        else:
            return None
    return data


def normalize_response(raw_vendor_response: dict, response_map: dict) -> dict:
    print("raw_vendor_response:",raw_vendor_response)
    print("response_map:", response_map)
    normalized = {}
    for our_field, vendor_path in response_map.items():
        value = get_value_by_path(raw_vendor_response, vendor_path)
        print(f'our_field',our_field)
        print(f'value',value)


        if our_field == "verified" and isinstance(value, str):
            value = value.upper() in (
                "VALID", "ACTIVE", "TRUE", "YES", "SUCCESS", "1"
            )

        normalized[our_field] = value
    return normalized 
