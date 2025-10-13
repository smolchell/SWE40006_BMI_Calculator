function calculateBMI() { 
    let weight = document.getElementById("weights").value; 
    let height = document.getElementById("height").value; 
    let bmi = (weight / (height * height) * 703); 

    document.getElementById("result").innerHTML = "Your BMI is: ";  
    document.getElementById("bmi").innerHTML = bmi.toFixed(2); 

    if (bmi < 18.5) {
        document.getElementById("category").innerHTML = "You are underweight";
    }
    else if (bmi >= 18.5 && bmi < 24.9) { 
        document.getElementById("category").innerHTML = "You are normal weight"; 
    } 
    else if (bmi >= 25 && bmi < 29.9) { 
        document.getElementById("category").innerHTML = "You are overweight";
    }
} 

function reload() { 
    document.location.reload();
}