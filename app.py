from flask import Flask, request, jsonify, render_template
import pandas as pd

app = Flask(__name__)

# Load the dataset only once, replace with your actual CSV filename
df = pd.read_csv("Original_data.csv")
df["Patient Id"] = df["Patient Id"].astype(str).str.strip()  # Clean whitespaces


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    patient_id = data.get("patient_id")

    try:
        # Find patient row in dataframe
        patient_row = df[df["Patient Id"] == str(patient_id).strip()]

        if patient_row.empty:
            return jsonify({"error": "Patient ID not found"}), 404

        # TODO: Replace below with your actual prediction logic
        disorder = "Example Disorder"
        subclass = "Example Subclass"

        return jsonify({"predicted_disorder": disorder, "disorder_subclass": subclass})

    except Exception as e:
        print("Prediction failed:", e)
        return jsonify({"error": "Prediction failed"}), 500


if __name__ == "__main__":
    app.run(debug=True)
