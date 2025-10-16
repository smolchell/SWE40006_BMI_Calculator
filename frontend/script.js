async function calculateBMI() {
  const hCm = parseFloat(document.getElementById("height").value);
  const wKg = parseFloat(document.getElementById("weight").value);
  const ageVal = parseInt(document.getElementById("age").value, 10);
  const sexEl = document.querySelector('input[name="sex"]:checked');
  const sexVal = sexEl ? sexEl.value : undefined;

  if (!hCm || !wKg || hCm <= 0 || wKg <= 0) {
    showResult("—", "Please enter valid height and weight.", "warn");
    return;
  }

  try {
    const res = await fetch("http://127.0.0.1:8000/bmi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ height: hCm, weight: wKg, age: ageVal, sex: sexVal })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Request failed" }));
      throw new Error(err.detail || "Request failed");
    }

    const data = await res.json(); // {bmi, category, [pediatric_category]}
    const label = data.pediatric_category || data.category;
    const meaning = label;

    const cls =
      label === "Underweight" ? "neutral" :
      label === "Normal weight" || label === "Healthy weight" ? "neutral" :
      label === "Overweight" ? "warn" : "bad";

  showResult(Number(data.bmi).toFixed(1), meaning, cls);
  } catch (e) {
    showResult("—", e.message || "Something went wrong.", "bad");
  }
}

function showResult(num, meaning, cls) {
  const box = document.getElementById("resultBox");
  box.classList.remove("neutral", "warn", "bad");
  box.classList.add(cls);
  document.getElementById("bmiNumber").textContent = num;
  document.getElementById("bmiMeaning").textContent = meaning;
}

function resetResult() {
  showResult("—", "Enter your details to calculate.", "neutral");
}
