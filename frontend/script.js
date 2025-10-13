const API_URL = "http://127.0.0.1:8000/api/bmi";

const form = document.getElementById("bmiForm");
const unitSelect = document.getElementById("unit");
const wlabel = document.getElementById("wlabel");
const hlabel = document.getElementById("hlabel");
const resetBtn = document.getElementById("resetBtn");

const errorsBox = document.getElementById("errors");
const result = document.getElementById("result");
const bmiValue = document.getElementById("bmiValue");
const categoryRow = document.getElementById("categoryRow");
const category = document.getElementById("category");
const noticeRow = document.getElementById("noticeRow");

function showErrors(msgs) {
  errorsBox.innerHTML = Array.isArray(msgs)
    ? "<ul>" + msgs.map(m => `<li>${m}</li>`).join("") + "</ul>"
    : msgs;
  errorsBox.classList.remove("hidden");
  result.classList.add("hidden");
}

function clearErrors() {
  errorsBox.classList.add("hidden");
  errorsBox.innerHTML = "";
}

function showResult(data) {
  clearErrors();
  result.classList.remove("hidden");
  bmiValue.textContent = data.bmi.toFixed(2);

  if (data.category) {
    category.textContent = data.category;
    categoryRow.classList.remove("hidden");
  } else {
    categoryRow.classList.add("hidden");
  }

  if (data.notice) {
    noticeRow.innerHTML = data.notice;
    noticeRow.classList.remove("hidden");
  } else {
    noticeRow.innerHTML = "";
    noticeRow.classList.add("hidden");
  }
}

// Update labels when switching units
unitSelect.addEventListener("change", () => {
  const imperial = unitSelect.value === "imperial";
  wlabel.textContent = imperial ? "(lb)" : "(kg)";
  hlabel.textContent = imperial ? "(in)" : "(cm)";
});

// Client-side syntax/range checks before calling API
function validateClient() {
  const age = parseInt(document.getElementById("age").value, 10);
  const sex = document.getElementById("sex").value;
  const unit = document.getElementById("unit").value;
  const weight = parseFloat(document.getElementById("weight").value);
  const height = parseFloat(document.getElementById("height").value);

  const errs = [];
  if (Number.isNaN(age)) errs.push("Age is required.");
  if (!sex) errs.push("Sex is required.");
  if (!unit) errs.push("Units are required.");
  if (Number.isNaN(weight)) errs.push("Weight is required and must be a number.");
  if (Number.isNaN(height)) errs.push("Height is required and must be a number.");

  if (!Number.isNaN(age) && (age < 2 || age > 120)) errs.push("Age must be between 2 and 120.");

  if (unit === "metric") {
    if (!Number.isNaN(weight) && (weight <= 0 || weight > 500)) errs.push("Weight (kg) must be between 1 and 500.");
    if (!Number.isNaN(height) && (height < 31 || height > 260)) errs.push("Height (cm) must be 31–260.");
  } else {
    if (!Number.isNaN(weight) && (weight <= 0 || weight > 1100)) errs.push("Weight (lb) must be between 1 and 1100.");
    if (!Number.isNaN(height) && (height < 13 || height > 110)) errs.push("Height (in) must be 13–110.");
  }

  return { ok: errs.length === 0, errs, data: { age, sex, unit, weight, height } };
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearErrors();

  const check = validateClient();
  if (!check.ok) {
    showErrors(check.errs);
    return;
  }

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(check.data),
    });

    const json = await res.json();

    if (!res.ok) {
      const detail = json?.detail ?? "Unknown error";
      showErrors(Array.isArray(detail) ? detail : [String(detail)]);
      return;
    }

    showResult(json);
  } catch (err) {
    showErrors(["Network error. Is the API running on port 8000?"]);
  }
});

resetBtn.addEventListener("click", () => {
  clearErrors();
  result.classList.add("hidden");
});
