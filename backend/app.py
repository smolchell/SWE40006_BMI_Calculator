from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, confloat
from bmi import calculate_bmi, bmi_category


class BMIRequest(BaseModel):
    weight: confloat(gt=0)
    height: confloat(gt=0)


app = FastAPI(title="BMI Calculator API", version="1.0")


@app.get("/")
def index():
    return {"message": "BMI Calculator API", "version": "1.0"}


@app.post("/bmi")
def bmi(req: BMIRequest):
    try:
        bmi_value = calculate_bmi(req.weight, req.height)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return {"bmi": bmi_value, "category": bmi_category(bmi_value)}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000)









