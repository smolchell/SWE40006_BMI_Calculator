from typing import Optional

from fastapi import FastAPI, HTTPException, Form
from pydantic import BaseModel, Field
from pathlib import Path
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.templating import Jinja2Templates
from bmi import calculate_bmi, bmi_category
from pediatric import bmi_percentile_for_age, pediatric_bmi_category

# new libraries
from fastapi.responses import HTMLResponse
from fastapi import FastAPI, Request 
from typing import Annotated
    
class BMIRequest(BaseModel):
    weight: float 
    height: float 
    age:int 
    sex: str  # 'male' or 'female' (case-insensitive)
    model_config = {"extra": "forbid"}

app = FastAPI(title="BMI Calculator API", version="1.2")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve the frontend (static files) under /frontend if the folder exists
app.mount("/static", StaticFiles(directory="static"), name="static")

templates = Jinja2Templates(directory="templates")

@app.get("/", response_class=HTMLResponse)
def index(request: Request):
    return templates.TemplateResponse('index.html',  {"request": request, "male":"checked"})

@app.post("/")
def bmi_endpoint(req: Annotated[BMIRequest, Form()], request: Request):
    try:
        # Determine height in meters from either height (cm) or height_cm (cm)
        height_cm = float(req.height)

        h_m = height_cm / 100.0
        bmi = calculate_bmi(req.weight, h_m)
        category = bmi_category(bmi)
        age = req.age
        weight = req.weight
        male = "checked" if req.sex == "male" else ""
        female = "checked" if req.sex == "female" else ""     

        response = {"request": request, "bmi": bmi, "category": category, "age": age, "height": height_cm, "weight": weight, "male":male, "female":female}
        # Include optional fields in response for UI echoing
        if req.age is not None:
            response["age"] = req.age
        if req.sex is not None:
            sex_norm = str(req.sex).strip().lower()
            if sex_norm in {"male", "female"}:
                response["sex"] = sex_norm
        # Pediatric classification for ages < 20 if sex is provided
        if req.age is not None and req.sex is not None:
            try:
                age_years = float(req.age)
                sex_norm = str(req.sex).strip().lower()
                if 2 <= age_years < 20 and sex_norm in {"male", "female"}:
                    pct = bmi_percentile_for_age(bmi, age_years, sex_norm)
                    if pct is not None:
                        response["pediatric_category"] = pediatric_bmi_category(pct)
            except Exception:
                pass
        return templates.TemplateResponse('index.html', response)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)










