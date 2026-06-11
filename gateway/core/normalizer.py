def get_value_by_path(data, path):
    keys = path.split(".")
    current = data
    for key in keys:
        if isinstance(current, dict) and key in current:
            current = current[key]
        else:
            return None
    return current


def normalize_response(raw_vendor_response, response_map):
    result = {}
    for our_field, vendor_path in response_map.items():
        result[our_field] = get_value_by_path(raw_vendor_response, vendor_path)
    return result