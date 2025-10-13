const API_URL = "http://127.0.0.1:8000/api/bmi";

const form = document.getElementById("bmiForm");
const errorsBox = document.getElementById("errors");
const result = document.getElementById("result");
const bmiValue = document.getElementById("bmiValue");
const categoryRow = document.getElementById("categoryRow");
const category = document.getElementById("category");
const noticeRow = document.getElementById("noticeRow");

function showErrors(msgs) {
  errorsBox.innerHTML = "<ul>" + msgs.map(m => `<li>${m}</li>`).join("") + "</ul>";
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

  noticeRow.innerHTML = data.notice ? data.notice : "";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const age = parseInt(document.getElementById("age").value);
  const sex = document.querySelector('input[name="sex"]:checked')?.value;
  const weight = parseFloat(document.getElementById("weight").value);
  const height = parseFloat(document.getElementById("height").value);

  const errs = [];
  if (!age || age < 2 || age > 120) errs.push("Enter a valid age (2–120).");
  if (!sex) errs.push("Please select your sex.");
  if (!weight || weight < 1 || weight > 500) errs.push("Weight must be 1–500 kg.");
  if (!height || height < 31 || height > 260) errs.push("Height must be 31–260 cm.");

  if (errs.length) return showErrors(errs);

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ age, sex, weight, height }),
    });
    const json = await res.json();

    if (!res.ok) {
      showErrors(Array.isArray(json.detail) ? json.detail : [String(json.detail)]);
      return;
    }

    showResult(json);
  } catch (err) {
    showErrors(["Network error. Ensure the API is running."]);
  }
});

document.getElementById("resetBtn").addEventListener("click", () => {
  clearErrors();
  result.classList.add("hidden");
});
