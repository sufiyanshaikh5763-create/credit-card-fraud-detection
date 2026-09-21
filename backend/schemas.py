from pydantic import BaseModel
from typing import Literal

class TransactionRequest(BaseModel):
    amount:float
    transaction_hour:int
    merchant_category: Literal[
        'Clothing',
        'Electronics',
        'Food',
        'Grocery',
        'Travel'
    ]
    foreign_transaction:int
    location_mismatch:int
    device_trust_score:float
    velocity_last_24h:int
    cardholder_age:int