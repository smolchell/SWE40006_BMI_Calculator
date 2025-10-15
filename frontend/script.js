async function calculateBMI() {
  const hCm = parseFloat(document.getElementById("height").value);
  const wKg = parseFloat(document.getElementById("weight").value);

  if (!hCm || !wKg || hCm <= 0 || wKg <= 0) {
    showResult("—", "Please enter valid height and weight.", "warn");
    return;
  }

  try {
    const res = await fetch("http://127.0.0.1:8000/bmi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ height: hCm, weight: wKg })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Request failed" }));
      throw new Error(err.detail || "Request failed");
    }

    const data = await res.json(); // {bmi, category}
    const cls =
      data.category === "Underweight" ? "neutral" :
      data.category === "Normal weight" ? "neutral" :
      data.category === "Overweight" ? "warn" : "bad";

    showResult(data.bmi.toFixed(1), data.category, cls);
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
