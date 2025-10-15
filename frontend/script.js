  function categorize(bmi){
    // Match the visual table: <=18.7 under, (18.7,22.0] normal, (22.0,24.0] over, >24 obese
    if (bmi <= 18.7) return {text:"Under weight", cls:"neutral"};
    if (bmi <= 22.0) return {text:"Normal", cls:"neutral"};
    if (bmi <= 24.0) return {text:"Over weight", cls:"warn"};
    return {text:"Obese", cls:"bad"};
  }

  function calculateBMI(){
    const hCm = parseFloat(document.getElementById("height").value);
    const wKg = parseFloat(document.getElementById("weight").value);

    if (!hCm || !wKg || hCm <= 0 || wKg <= 0){
      showResult("—", "Please enter valid height and weight.", "warn");
      return;
    }

    const hM = hCm / 100;
    const bmi = wKg / (hM*hM);
    const cat = categorize(bmi);

    showResult(bmi.toFixed(1), cat.text, cat.cls);
  }

  function showResult(num, meaning, cls){
    const box = document.getElementById("resultBox");
    box.classList.remove("neutral","warn","bad");
    box.classList.add(cls);
    document.getElementById("bmiNumber").textContent = num;
    document.getElementById("bmiMeaning").textContent = meaning;
  }

  function resetResult(){
    showResult("—", "Enter your details to calculate.", "neutral");
  }
