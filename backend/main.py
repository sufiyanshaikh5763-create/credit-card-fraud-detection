from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd

from schemas import TransactionRequest
from model_loader import load_model

app = FastAPI(
    title="Credit Card Fraud Detection API",
    description="API for detecting fraudulent credit card transactions",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
# load the trained model once when the API starts
model = load_model()

@app.get("/health")
def health_check():
    return{
        "status":"healthy",
        "model_loaded":True
    }

@app.post("/predict")
def predict(transaction: TransactionRequest):

    ## convert request data into a Dataframe
    input_data=pd.DataFrame([{
        "amount":transaction.amount,
        "transaction_hour":transaction.transaction_hour,
        "merchant_category":transaction.merchant_category,
        "foreign_transaction":transaction.foreign_transaction,
        "location_mismatch":transaction.location_mismatch,
        "device_trust_score":transaction.device_trust_score,
        "velocity_last_24h":transaction.velocity_last_24h,
        "cardholder_age":transaction.cardholder_age
    }])

    # Make Prediction
    prediction = model.predict(input_data)[0]

    # Get probablity
    probablities = model.predict_proba(input_data)[0]

    legitimate_probablity = probablities[0]
    fraud_probablity = probablities[1]

    return{
        "prediction":int(prediction),
        "is_fraud":bool(prediction),
        "fraud_probablity":float(fraud_probablity),
        "legitimate_probablity":float(legitimate_probablity)
    }
