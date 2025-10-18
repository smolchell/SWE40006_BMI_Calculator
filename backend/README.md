# BMI Calculator Backend

A FastAPI Python implementation for a BMI calculator app.
Overview
Framework: FastAPI
ASGI server: Uvicorn

Quick start 
1) Create and/or activate a venv

```powershell
# create venv (one-time)
python -m venv venv

# activate (PowerShell)
.\venv\Scripts\Activate.ps1
```

2) Install dependencies

```powershell
python -m pip install --upgrade pip
pip install -r requirements.txt
```

3) Run the app (development)

Run `app.py` script
```
cd ./backend
python run app.py
```

The API will be available at http://127.0.0.1:8000

API endpoints

- GET /
  - Returns html template `index.html` with initial data

- POST /bmi
  - Accepts JSON body: `{ "weight": <kg>, "height": <cm>, "age": <years>, "sex": <male/female> }`
  - Returns JSON: `{ "bmi": <number>, "category": "<string>", "weight": <kg>, "height": <cm>, "age": <years>, "sex": <male/female> }`


Repository files of interest

- `app.py`  FastAPI application 
- `bmi.py`  Logic for adults (calculate_bmi, bmi_category)
- `pediatric.py`  Logic for children and teens 
- `requirements.txt`  runtime dependencies



