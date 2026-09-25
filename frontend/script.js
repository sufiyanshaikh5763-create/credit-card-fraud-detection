const form = document.getElementById("fraudForm");

const resultModal = document.getElementById("resultModal");

const resultPopup = document.getElementById("result");

const resultIcon = document.getElementById("resultIcon");

const resultTitle = document.getElementById("resultTitle");

const resultSubtitle = document.getElementById("resultSubtitle");

const fraudProbability = document.getElementById("fraudProbability");

const legitimateProbability =
    document.getElementById("legitimateProbability");

const fraudBar = document.getElementById("fraudBar");

const legitimateBar =
    document.getElementById("legitimateBar");

const riskBadge =
    document.getElementById("riskBadge");

const predictButton =
    document.getElementById("predictButton");

const buttonText =
    document.getElementById("buttonText");

const buttonIcon =
    document.getElementById("buttonIcon");

const closeResult =
    document.getElementById("closeResult");

const closeResultButton =
    document.getElementById("closeResultButton");

const modalOverlay =
    document.getElementById("modalOverlay");


/* =========================================================
   CLOSE RESULT
========================================================= */

function closeModal() {

    resultModal.classList.add("hidden");

    resultPopup.classList.remove("fraud-result");

}


/* =========================================================
   OPEN RESULT
========================================================= */

function openModal() {

    resultModal.classList.remove("hidden");

}


/* =========================================================
   CLOSE EVENTS
========================================================= */

closeResult.addEventListener(
    "click",
    closeModal
);

closeResultButton.addEventListener(
    "click",
    closeModal
);

modalOverlay.addEventListener(
    "click",
    closeModal
);


/* =========================================================
   ESC KEY
========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            !resultModal.classList.contains("hidden")
        ) {
            closeModal();
        }

    }
);


/* =========================================================
   FORM SUBMISSION
========================================================= */

form.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        /* -----------------------------------------
           Loading state
        ----------------------------------------- */

        predictButton.disabled = true;

        buttonText.textContent =
            "Analyzing Transaction...";

        buttonIcon.textContent = "◌";


        try {

            /* -----------------------------------------
               Collect form data
            ----------------------------------------- */

            const transaction = {

                amount:
                    Number(
                        document.getElementById("amount").value
                    ),

                transaction_hour:
                    Number(
                        document.getElementById(
                            "transaction_hour"
                        ).value
                    ),

                merchant_category:
                    document.getElementById(
                        "merchant_category"
                    ).value,

                foreign_transaction:
                    Number(
                        document.getElementById(
                            "foreign_transaction"
                        ).value
                    ),

                location_mismatch:
                    Number(
                        document.getElementById(
                            "location_mismatch"
                        ).value
                    ),

                device_trust_score:
                    Number(
                        document.getElementById(
                            "device_trust_score"
                        ).value
                    ),

                velocity_last_24h:
                    Number(
                        document.getElementById(
                            "velocity_last_24h"
                        ).value
                    ),

                cardholder_age:
                    Number(
                        document.getElementById(
                            "cardholder_age"
                        ).value
                    )

            };


            console.log(
                "TRANSACTION SENT:",
                transaction
            );


            /* -----------------------------------------
               API request
            ----------------------------------------- */

            const response = await fetch(
                "http://credit-card-fraud-detection-bwbf.onrender.com/predict",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(transaction)
                }
            );


            const data =
                await response.json();


            console.log(
                "API RESPONSE:",
                data
            );


            /* -----------------------------------------
               API error
            ----------------------------------------- */

            if (!response.ok) {

                throw new Error(
                    data.detail ||
                    "Prediction request failed"
                );

            }


            /* -----------------------------------------
               Validate response
            ----------------------------------------- */

            const fraud =
                Number(data.fraud_probablity);

            const legitimate =
                Number(
                    data.legitimate_probablity
                );


            if (
                !Number.isFinite(fraud) ||
                !Number.isFinite(legitimate)
            ) {

                throw new Error(
                    "API returned invalid probability values."
                );

            }


            /* -----------------------------------------
               Convert to percentage
            ----------------------------------------- */

            const fraudPercent =
                fraud * 100;

            const legitimatePercent =
                legitimate * 100;


            const fraudText =
                fraudPercent.toFixed(2) + "%";

            const legitimateText =
                legitimatePercent.toFixed(2) + "%";


            /* -----------------------------------------
               Update probabilities
            ----------------------------------------- */

            fraudProbability.textContent =
                fraudText;

            legitimateProbability.textContent =
                legitimateText;


            fraudBar.style.width =
                fraudText;

            legitimateBar.style.width =
                legitimateText;


            /* -----------------------------------------
               Fraud / Legitimate UI
            ----------------------------------------- */

            if (data.is_fraud === true) {

                resultPopup.classList.add(
                    "fraud-result"
                );

                resultIcon.textContent = "⚠";

                resultTitle.textContent =
                    "Potential Fraud Detected";

                resultSubtitle.textContent =
                    "The AI model identified this transaction as potentially fraudulent.";

                riskBadge.textContent =
                    "HIGH RISK";

            }

            else {

                resultPopup.classList.remove(
                    "fraud-result"
                );

                resultIcon.textContent = "✓";

                resultTitle.textContent =
                    "Transaction Appears Legitimate";

                resultSubtitle.textContent =
                    "The AI model identified a low likelihood of fraud.";

                riskBadge.textContent =
                    "LOW RISK";

            }


            /* -----------------------------------------
               Show popup
            ----------------------------------------- */

            openModal();


        }

        catch (error) {

            console.error(
                "PREDICTION ERROR:",
                error
            );


            /* Show error inside popup */

            resultPopup.classList.remove(
                "fraud-result"
            );

            resultIcon.textContent = "×";

            resultTitle.textContent =
                "Prediction Error";

            resultSubtitle.textContent =
                error.message;

            fraudProbability.textContent =
                "--";

            legitimateProbability.textContent =
                "--";

            fraudBar.style.width = "0%";

            legitimateBar.style.width = "0%";

            riskBadge.textContent =
                "ERROR";


            openModal();

        }

        finally {

            predictButton.disabled = false;

            buttonText.textContent =
                "Analyze Transaction";

            buttonIcon.textContent =
                "→";

        }

    }
);