document.getElementById("prediction-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const progressBar = document.querySelector(".progress-bar");
  const resultContainer = document.getElementById("prediction-result");
  const suffixInput = document.getElementById("Patient Id");
  const diseaseField = document.getElementById("disease-prediction");
  const subclassField = document.getElementById("subclass-prediction");

  // Reset previous results
  diseaseField.textContent = "";
  subclassField.textContent = "";
  resultContainer.style.display = "none";
  progressBar.style.display = "block";

  // Extract and validate patient ID suffix
  const patientIdSuffix = suffixInput.value.trim();
  if (!patientIdSuffix.match(/^[A-Za-z0-9]+$/)) {
    alert("Please enter a valid alphanumeric Patient ID suffix.");
    progressBar.style.display = "none";
    return;
  }

  const fullPatientId = "PID0x" + patientIdSuffix;
  const data = { patient_id: fullPatientId };

  // Make the POST request
  fetch("http://127.0.0.1:5000/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Prediction failed. Please check the Patient ID and try again.");
      }
      return response.json();
    })
    .then((result) => {
      progressBar.style.display = "none";
      resultContainer.style.display = "block";

      // Display results (handle both possible naming styles from backend)
      diseaseField.textContent = result.prediction || result.genetic_disorder || "Not available";
      subclassField.textContent = result.subclass || result.disorder_subclass || "Not available";

      resultContainer.scrollIntoView({ behavior: "smooth" });
    })
    .catch((error) => {
      progressBar.style.display = "none";
      alert("Error: " + error.message);
      console.error("Fetch Error:", error);
    });
});
