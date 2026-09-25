from pydantic import BaseModel, Field
from typing import Literal


class TransactionRequest(BaseModel):
    amount: float = Field(..., ge=0)

    transaction_hour: int = Field(..., ge=0, le=23)

    merchant_category: Literal[
        "Clothing",
        "Electronics",
        "Food",
        "Grocery",
        "Travel"
    ]

    foreign_transaction: int = Field(..., ge=0, le=1)

    location_mismatch: int = Field(..., ge=0, le=1)

    device_trust_score: float = Field(..., ge=0,le=100)

    velocity_last_24h: int = Field(..., ge=0)

    cardholder_age: float = Field(..., ge=0)