# Credit Card Fraud Detection

An end-to-end machine learning application for detecting potentially fraudulent credit card transactions.

This project combines exploratory data analysis, machine learning, model explainability, a FastAPI backend, and an interactive web frontend into a complete fraud detection application.

Users can enter transaction details through the web interface, send them to the FastAPI API, and receive a fraud prediction along with fraud and legitimate transaction probabilities.

---

## Project Overview

Credit card fraud detection is a highly imbalanced binary classification problem where fraudulent transactions represent only a small portion of all transactions.

The goal of this project is to build a machine learning system that can identify potentially fraudulent transactions while maintaining strong fraud detection performance.

The project covers the complete workflow:

- Data exploration
- Exploratory Data Analysis (EDA)
- Data preprocessing
- Handling class imbalance
- Model comparison
- Stratified cross-validation
- XGBoost hyperparameter tuning
- Final model evaluation
- Feature importance analysis
- SHAP explainability
- Model serialization
- FastAPI REST API
- Interactive frontend
- Git/GitHub version control

---

## Project Architecture

```text
                         ┌──────────────────────┐
                         │       User           │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │    Web Frontend      │
                         │   HTML/CSS/JavaScript│
                         └──────────┬───────────┘
                                    │
                              HTTP POST
                              /predict
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   FastAPI Backend    │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │ Saved ML Pipeline    │
                         │ Preprocessing +      │
                         │ XGBoost Classifier   │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   Prediction Result  │
                         │ Fraud / Legitimate  │
                         │ Probabilities        │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │    Result Card       │
                         │      Frontend        │
                         └──────────────────────┘
```

---

## Technology Stack

| Component | Technology |
|---|---|
| Programming Language | Python |
| Machine Learning | Scikit-learn, XGBoost |
| Data Analysis | Pandas, NumPy |
| Visualization | Matplotlib, Seaborn |
| Explainability | SHAP |
| Backend | FastAPI |
| API Server | Uvicorn |
| Frontend | HTML, CSS, JavaScript |
| Model Serialization | Joblib |
| Version Control | Git, GitHub |

---

## Dataset

The project uses a credit card fraud detection dataset containing **10,000 transactions**.

The dataset contains a highly imbalanced target variable, with fraudulent transactions representing a small minority of all transactions.

### Dataset Statistics

| Metric | Value |
|---|---:|
| Total Transactions | 10,000 |
| Fraudulent Transactions | 151 |
| Legitimate Transactions | 9,849 |
| Fraud Rate | 1.51% |
| Legitimate Rate | 98.49% |

### Features

| Feature | Description |
|---|---|
| `amount` | Transaction amount |
| `transaction_hour` | Hour at which the transaction occurred |
| `merchant_category` | Category of the merchant |
| `foreign_transaction` | Indicates whether the transaction was foreign |
| `location_mismatch` | Indicates a mismatch between expected and transaction location |
| `device_trust_score` | Trust score associated with the transaction device |
| `velocity_last_24h` | Transaction velocity during the previous 24 hours |
| `cardholder_age` | Age of the cardholder |
| `is_fraud` | Target variable indicating whether the transaction is fraudulent |

---

## Exploratory Data Analysis

Exploratory Data Analysis was performed to understand the structure of the dataset and identify patterns associated with fraudulent transactions.

The analysis included:

- Univariate feature analysis
- Target class distribution
- Transaction amount distribution
- Transaction hour analysis
- Merchant category analysis
- Foreign transaction analysis
- Location mismatch analysis
- Device trust score analysis
- Transaction velocity analysis
- Cardholder age analysis
- Bivariate analysis
- Fraud vs legitimate transaction comparisons

---

## Data Preprocessing

The preprocessing pipeline was designed so that the same transformations are consistently applied during both training and prediction.

### Categorical Features

`merchant_category` is a nominal categorical feature. Therefore, **One-Hot Encoding** was used rather than Label Encoding.

### Pipeline Architecture

```text
Raw Transaction Data
        │
        ▼
Preprocessing Pipeline
        │
        ├── Numerical Feature Processing
        ├── One-Hot Encoding
        └── Remaining Features
        │
        ▼
XGBoost Classifier
        │
        ▼
Prediction
```

The preprocessing steps and classifier were saved together as a single pipeline, allowing the backend to send raw transaction data directly to the saved model.

---

## Handling Class Imbalance

The dataset contains only **151 fraudulent transactions out of 10,000 transactions**.

```text
Legitimate:  9,849
Fraud:         151
```

Because of this imbalance, accuracy alone is not sufficient to evaluate the model.

The project therefore focuses on:

- Precision
- Recall
- F1-score
- ROC-AUC
- Confusion Matrix

---

## Train/Test Split

The dataset was divided into training and testing sets using a stratified split.

```text
Training Set
8,000 transactions
    ├── Legitimate: 7,879
    └── Fraud:        121

Testing Set
2,000 transactions
    ├── Legitimate: 1,970
    └── Fraud:         30
```

The test set was kept separate for final model evaluation.

---

## Machine Learning Models

Several classification algorithms were evaluated:

1. Logistic Regression
2. Random Forest
3. Decision Tree
4. XGBoost
5. Support Vector Machine (SVM)

The models were evaluated using stratified 5-fold cross-validation.

---

## Cross-Validation Results

The following are the mean results obtained from 5-fold stratified cross-validation.

| Model | Precision | Recall | F1-Score | ROC-AUC |
|---|---:|---:|---:|---:|
| Logistic Regression | 0.263 | 0.967 | 0.413 | 0.992 |
| Random Forest | 0.986 | 0.653 | 0.784 | 0.999 |
| Decision Tree | 0.986 | 0.653 | 0.784 | 0.999 |
| XGBoost | 0.991 | 0.967 | 0.979 | 1.000 |
| SVM | 0.613 | 0.850 | 0.711 | 0.996 |

---

## XGBoost Hyperparameter Tuning

XGBoost was selected for further optimization.

RandomizedSearchCV was used with stratified cross-validation and **F1-score** as the optimization metric.

### Best Parameters

```text
n_estimators = 300
max_depth = 3
learning_rate = 0.1
min_child_weight = 5
subsample = 0.8
colsample_bytree = 0.8
```

### Best Cross-Validation F1-Score

```text
0.9877
```

---

## Tuned Model Cross-Validation

| Metric | Mean | Std |
|---|---:|---:|
| Precision | 0.9843 | 0.0192 |
| Recall | 0.9917 | 0.0167 |
| F1-Score | 0.9877 | 0.0100 |
| ROC-AUC | 0.99996 | 0.00008 |

---

## Final Test Set Evaluation

The tuned XGBoost pipeline was evaluated on the untouched test set containing **2,000 transactions**.

| Metric | Score |
|---|---:|
| Accuracy | 1.000 |
| Precision | 1.000 |
| Recall | 1.000 |
| F1-Score | 1.000 |
| ROC-AUC | 1.000 |

### Confusion Matrix

```text
                    Predicted
                  Legitimate  Fraud
Actual Legitimate    1970       0
Actual Fraud            0      30
```

The model correctly classified all 2,000 transactions in this particular held-out test set.

> Note: These results describe performance on this specific dataset and test split. They should not be interpreted as evidence that the model will achieve 100% accuracy on unseen real-world financial transactions.

---

## Feature Importance

Feature importance was extracted from the tuned XGBoost classifier.

| Feature | Importance |
|---|---:|
| `device_trust_score` | 0.2010 |
| `transaction_hour` | 0.1948 |
| `foreign_transaction` | 0.1414 |
| `velocity_last_24h` | 0.1380 |
| `location_mismatch` | 0.1250 |
| `amount` | 0.0503 |
| `merchant_category_Grocery` | 0.0462 |
| `merchant_category_Clothing` | 0.0353 |
| `merchant_category_Electronics` | 0.0350 |
| `merchant_category_Travel` | 0.0275 |
| `cardholder_age` | 0.0032 |
| `merchant_category_Food` | 0.0023 |

Feature importance indicates how the model used features during prediction and should not be interpreted as causal evidence.

---

## Model Explainability with SHAP

SHAP (SHapley Additive exPlanations) was used to understand how individual features influenced model predictions.

### Global Explainability

SHAP summary analysis was used to understand the overall contribution of features across the test dataset.

Important model features included:

- `transaction_hour`
- `device_trust_score`
- `foreign_transaction`
- `location_mismatch`
- `velocity_last_24h`
- `amount`

### Local Explainability

SHAP waterfall plots were also generated for individual transactions.

For a fraud prediction, the waterfall plot shows which features pushed the model output toward fraud and which pushed it toward legitimate.

This provides insight into **why the model made a particular prediction** rather than only showing the final classification.

---

## Model Serialization

The complete preprocessing and XGBoost model pipeline was serialized using Joblib.

```text
model/
└── fraud_detection_model.pkl
```

The complete pipeline was saved rather than only the XGBoost classifier. This allows the backend to pass raw transaction features directly to the saved pipeline while maintaining the preprocessing used during training.

---

## Backend API

The application uses **FastAPI** to expose the trained model as a REST API.

### Main Endpoint

```text
POST /predict
```

Example request:

```json
{
  "amount": 400,
  "transaction_hour": 12,
  "merchant_category": "Clothing",
  "foreign_transaction": 0,
  "location_mismatch": 1,
  "device_trust_score": 0.8,
  "velocity_last_24h": 2,
  "cardholder_age": 35
}
```

Example response:

```json
{
  "prediction": 0,
  "is_fraud": false,
  "fraud_probability": 0.019850604236125946,
  "legitimate_probability": 0.9801493883132935
}
```

The frontend uses this response to display:

- Fraud or legitimate classification
- Fraud probability
- Legitimate probability

---

## Frontend

The frontend was built using:

- HTML
- CSS
- JavaScript

The interface provides a transaction form where users can enter the required transaction information.

```text
User Input
    │
    ▼
JavaScript
    │
    ▼
POST /predict
    │
    ▼
FastAPI
    │
    ▼
ML Model
    │
    ▼
JSON Response
    │
    ▼
Frontend Result Card
```

The UI displays the prediction dynamically without requiring the user to manually interact with the API.

---

## Project Structure

```text
credit-card-fraud-detection/
│
├── backend/
│   ├── __init__.py
│   ├── main.py
│   ├── model_loader.py
│   └── schemas.py
│
├── frontend/
│   ├── index.html
│   ├── script.js
│   └── style.css
│
├── model/
│   └── fraud_detection_model.pkl
│
├── notebooks/
│   └── fraud_detection.ipynb
│
├── .gitignore
├── README.md
└── requirements.txt
```

---

## Running the Project Locally

### 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd Fraud-Detection
```

### 2. Create a Virtual Environment

```bash
python -m venv venv
```

### 3. Activate the Virtual Environment

#### Windows PowerShell

```powershell
.env\Scripts\Activate.ps1
```

### 4. Install Dependencies

```bash
pip install -r requirements.txt
```

### 5. Start the FastAPI Backend

From the project root:

```bash
uvicorn backend.main:app --reload
```

The API will normally be available at:

```text
http://127.0.0.1:8000
```

### 6. Open API Documentation

FastAPI automatically provides interactive Swagger documentation at:

```text
http://127.0.0.1:8000/docs
```

### 7. Start the Frontend

From the project root:

```bash
python -m http.server 5500 --directory frontend
```

Then open:

```text
http://127.0.0.1:5500
```

Make sure the FastAPI backend is running before sending predictions from the frontend.

---

## API Testing

The FastAPI Swagger interface can be used to test the prediction endpoint independently of the frontend.

Open:

```text
http://127.0.0.1:8000/docs
```

Then:

1. Open `POST /predict`
2. Select **Try it out**
3. Enter transaction data
4. Select **Execute**
5. Inspect the prediction and probabilities

---

## Evaluation Strategy

Because fraud detection is an imbalanced classification problem, the project emphasizes the following metrics.

### Precision

Measures how many transactions predicted as fraud were actually fraudulent.

```text
Precision = TP / (TP + FP)
```

### Recall

Measures how many actual fraudulent transactions were successfully detected.

```text
Recall = TP / (TP + FN)
```

### F1-Score

Provides a balance between precision and recall.

```text
F1 = 2 × (Precision × Recall) / (Precision + Recall)
```

### ROC-AUC

Measures the model's ability to distinguish between fraudulent and legitimate transactions across classification thresholds.

---

## Key Machine Learning Concepts Demonstrated

- Binary classification
- Imbalanced datasets
- Exploratory Data Analysis
- Feature preprocessing
- One-Hot Encoding
- Stratified train/test splitting
- Stratified K-Fold cross-validation
- Hyperparameter optimization
- XGBoost
- Precision/Recall trade-offs
- F1-score optimization
- ROC-AUC
- Confusion matrices
- Feature importance
- SHAP explainability
- Model serialization
- ML inference pipelines

---

## Key Engineering Concepts Demonstrated

- Separating frontend and backend
- REST API development
- FastAPI
- Request validation
- JSON-based communication
- Model serving
- Reusable ML pipelines
- Git version control
- GitHub repository management
- Local development environments
- Production-oriented project structure

---

## Limitations

Although the model achieved strong results on the available test set, several limitations should be considered.

- The dataset contains only 10,000 transactions.
- Only 151 transactions are fraudulent.
- The test set contains only 30 fraudulent transactions.
- The dataset may not represent real-world banking transaction behavior.
- A perfect score on one test split does not guarantee equivalent performance on new real-world data.
- Model performance may change when transaction distributions change over time.
- Additional validation on larger and more representative datasets would be required for production financial use.

---

## Future Improvements

Potential future improvements include:

- Docker containerization
- Cloud deployment
- Automated API testing
- Unit and integration tests
- CI/CD pipeline
- Model monitoring
- Data drift detection
- Prediction logging
- Authentication and authorization
- Rate limiting
- Database integration
- Batch prediction support
- Real-time transaction monitoring
- Improved SHAP explanations in the frontend
- Model versioning
- Automated model retraining

---

## Skills Demonstrated

```text
Python
Machine Learning
Scikit-learn
XGBoost
Pandas
NumPy
Matplotlib
Seaborn
SHAP
FastAPI
REST APIs
HTML
CSS
JavaScript
Git
GitHub
Model Deployment
ML Pipelines
Model Explainability
```

---

## Disclaimer

This project is intended for educational and demonstration purposes.

The predictions produced by this application should not be used as the sole basis for real financial decisions or transaction approval/rejection.
