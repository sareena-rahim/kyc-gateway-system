from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    DateTime,
    ForeignKey,
    Text
)

from datetime import datetime
from gateway.db import Base


class ClientMaster(Base):
    __tablename__ = "client_master"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    api_key = Column(String(100), unique=True, nullable=False)
    is_active = Column(Boolean, default=True)
    is_subscribed = Column(Boolean, default=False)
    api_key = Column(String(100), unique=True, nullable=True)
    subscription_plan = Column(String(50), nullable=True) # BASIC, STANDARD, PREMIUM
    created_at = Column(DateTime, default=datetime.utcnow)



class APIMaster(Base):
    __tablename__ = "api_master"

    id = Column(Integer, primary_key=True, autoincrement=True)
    service_code = Column(String(50), nullable=False)
    vendor_name = Column(String(100), nullable=False)
    endpoint_url = Column(String(255), nullable=False)
    http_method = Column(String(10), default="POST")
    headers_template = Column(Text)
    payload_template = Column(Text)
    response_map = Column(Text)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class ServicesMaster(Base):
    __tablename__ = "services_master"

    id = Column(Integer, primary_key=True, autoincrement=True)
    service_code = Column(String(50), unique=True, nullable=False)
    display_name = Column(String(100))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class ClientCredits(Base):
    __tablename__ = "client_credits"

    id = Column(Integer, primary_key=True, autoincrement=True)
    client_id = Column(
        Integer,
        ForeignKey("client_master.id"),
        nullable=False
    )
    balance = Column(Integer, default=0)
    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )


class ClientCreditsLedger(Base):
    __tablename__ = "client_credits_ledger"

    id = Column(Integer, primary_key=True, autoincrement=True)
    client_id = Column(
        Integer,
        ForeignKey("client_master.id"),
        nullable=False
    )
    transaction_type = Column(String(10), nullable=False)
    amount = Column(Integer, nullable=False)
    balance_after = Column(Integer, nullable=False)
    reference_txn_id = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow)


class AuditLog(Base):
    __tablename__ = "audit_log"

    id = Column(Integer, primary_key=True, autoincrement=True)
    transaction_id = Column(
        String(100),
        unique=True,
        nullable=False
    )
    client_id = Column(
        Integer,
        ForeignKey("client_master.id"),
        nullable=False
    )
    service_code = Column(String(50))
    inbound_payload = Column(Text)
    vendor_request = Column(Text)
    vendor_response = Column(Text)
    normalized_response = Column(Text)
    status = Column(String(20), default="INITIATED")
    created_at = Column(DateTime, default=datetime.utcnow)