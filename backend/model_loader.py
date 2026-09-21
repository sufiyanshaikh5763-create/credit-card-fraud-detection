import joblib
from pathlib import Path

MODEL_PATH = (
    Path(__file__).resolve().parent.parent
    / "model"
    / "fraud_detection_model.pkl"
)


def load_model():
    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            f"Model file not found at: {MODEL_PATH}"
        )

    model = joblib.load(MODEL_PATH)
    return model


if __name__ == "__main__":
    model = load_model()
    print("Model loaded successfully!")
    print(model)