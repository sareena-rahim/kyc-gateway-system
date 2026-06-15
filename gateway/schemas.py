

from pydantic import BaseModel
from typing import Optional, Dict, Any, List




class CreateServiceRequest(BaseModel):
    service_code: str
    display_name: str


class CreateAPIConfigRequest(BaseModel):
    service_code:     str
    vendor_name:      str
    endpoint_url:     str
    http_method:      str = "POST"
    headers_template: Optional[Dict] = None
    payload_template: Dict
    response_map:     Dict


class CreateClientRequest(BaseModel):
    name:    str
    api_key: str


class TopupRequest(BaseModel):
    api_key: str
    amount:  int




class ServiceResponse(BaseModel):
    id:           int
    service_code: str
    display_name: Optional[str]
    is_active:    bool

    class Config:
        from_attributes = True


class ClientResponse(BaseModel):
    id:        int
    name:      str
    api_key:   str
    is_active: bool

    class Config:
        from_attributes = True


class TopupResponse(BaseModel):
    client:      str
    amount:      int
    new_balance: int




class KYCRequest(BaseModel):
    client_api_key: str
    service_code:   str
    payload:        Dict[str, Any]

    class Config:
        json_schema_extra = {
            "example": {
                "client_api_key": "test-key-123",
                "service_code":   "PAN_FETCH",
                "payload": {
                    "pan_number": "CGQPN5366Q"
                }
            }
        }




class KYCResult(BaseModel):
    verified:       Optional[bool] = None
    name:           Optional[str]  = None
    dob:            Optional[str]  = None
    message:        Optional[str]  = None
    gender:         Optional[str]  = None
    pan_type:       Optional[str]  = None
    aadhaar_linked: Optional[str]  = None


class KYCResponse(BaseModel):
    transaction_id:    str
    status:            str
    service:           str
    client:            str
    credits_before:    int
    credits_remaining: int
    result:            KYCResult


class BalanceResponse(BaseModel):
    client:  str
    balance: int


class LogEntry(BaseModel):
    transaction_id: str
    service:        str
    status:         str
    created_at:     str


class LogsResponse(BaseModel):
    client: str
    total:  int
    logs:   List[LogEntry]