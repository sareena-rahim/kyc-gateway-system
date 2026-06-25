# gateway/core/utils.py

def mask_aadhaar(value: str) -> str:
    cleaned = value.replace(" ", "")
    return "XXXX XXXX " + cleaned[-4:]


def mask_pan(value: str) -> str:
    if len(value) < 5:
        return value
    return value[:2] + "XXX" + value[5:]


def mask_payload(payload: dict) -> dict:
    masked = payload.copy()
    if "aadhaar_number" in masked and masked["aadhaar_number"]:
        masked["aadhaar_number"] = mask_aadhaar(masked["aadhaar_number"])
    if "pan_number" in masked and masked["pan_number"]:
        masked["pan_number"] = mask_pan(masked["pan_number"])
    return masked