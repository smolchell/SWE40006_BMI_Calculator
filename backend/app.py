from typing import Optional

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from pathlib import Path
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from bmi import calculate_bmi, bmi_category
from pediatric import bmi_percentile_for_age, pediatric_bmi_category

class BMIRequest(BaseModel):
    weight: float = Field(..., gt=0, description="Weight in kilograms")
    height: Optional[float] = Field(None, gt=0, description="Height in centimeters")
    height_cm: Optional[float] = Field(None, gt=0, description="Height in centimeters")

    age: Optional[int] = Field(None, ge=0)
    sex: Optional[str] = None  # 'male' or 'female' (case-insensitive)

app = FastAPI(title="BMI Calculator API", version="1.2")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve the frontend (static files) under /frontend if the folder exists
_FRONTEND_DIR = (Path(__file__).resolve().parent.parent / "frontend").resolve()
if _FRONTEND_DIR.exists():
    app.mount("/frontend", StaticFiles(directory=str(_FRONTEND_DIR), html=True), name="frontend")

@app.get("/")
def index():
    return {"message": "BMI Calculator API", "version": "1.2"}

@app.post("/bmi")
def bmi_endpoint(req: BMIRequest):
    try:
        # Determine height in meters from either height (cm) or height_cm (cm)
        height_cm = None
        if req.height is not None:
            height_cm = float(req.height)
        if req.height_cm is not None:
            height_cm = float(req.height_cm)

        if height_cm is None:
            raise ValueError("Provide height in centimeters via 'height' or 'height_cm'.")

        h_m = height_cm / 100.0
        bmi = calculate_bmi(req.weight, h_m)
        category = bmi_category(bmi)

        resp = {"bmi": bmi, "category": category}
        # Include optional fields in response for UI echoing
        if req.age is not None:
            resp["age"] = req.age
        if req.sex is not None:
            sex_norm = str(req.sex).strip().lower()
            if sex_norm in {"male", "female"}:
                resp["sex"] = sex_norm
        # Pediatric classification for ages < 20 if sex is provided
        if req.age is not None and req.sex is not None:
            try:
                age_years = float(req.age)
                sex_norm = str(req.sex).strip().lower()
                if 2 <= age_years < 20 and sex_norm in {"male", "female"}:
                    pct = bmi_percentile_for_age(bmi, age_years, sex_norm)
                    if pct is not None:
                        resp["pediatric_category"] = pediatric_bmi_category(pct)
            except Exception:
                pass
        return resp
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)










