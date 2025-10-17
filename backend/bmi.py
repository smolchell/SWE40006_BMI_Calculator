from typing import Tuple
def calculate_bmi(weight_kg: float, height_m: float) -> float:

    if weight_kg <= 0:
        raise ValueError("weight_kg must be > 0")
    if height_m <= 0:
        raise ValueError("height_m must be > 0")

    bmi = weight_kg / (height_m ** 2)
    return round(bmi, 2)


def bmi_category(bmi: float) -> str:
    """Return standard WHO BMI category for a BMI value."""
    if bmi < 18.5:
        return "Under Weight"
    if 18.5 <= bmi < 25:
        return "Normal Weight"
    if 25 <= bmi < 30:
        return "Over Weight"
    return "Obese"
