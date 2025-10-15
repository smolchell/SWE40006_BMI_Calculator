from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, confloat
from fastapi.middleware.cors import CORSMiddleware
from bmi import calculate_bmi, bmi_category

class BMIRequest(BaseModel):
    # expecting kilograms and centimeters from the UI
    weight: confloat(gt=0)  # kg
    height: confloat(gt=0)  # cm

app = FastAPI(title="BMI Calculator API", version="1.0")

# allow your frontend to call this in dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500", "http://localhost:5500", "http://127.0.0.1:8000", "http://localhost:8000", "http://127.0.0.1:3000", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def index():
    return {"message": "BMI Calculator API", "version": "1.0"}

@app.post("/bmi")
def bmi_endpoint(req: BMIRequest):
    try:
        # convert cm -> m
        h_m = req.height / 100.0
        bmi = calculate_bmi(req.weight, h_m)
        category = bmi_category(bmi)
        return {"bmi": bmi, "category": category}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)










