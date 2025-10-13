# BMI Calculator Backend

A minimal FastAPI backend for the BMI calculator app.
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

With the venv active:

```powershell
python -m uvicorn app:app --reload --port 8000
```

Without activating the venv (use the venv python directly):

```powershell
.\venv\Scripts\python.exe -m uvicorn app:app --reload --port 8000
```

The API will be available at http://127.0.0.1:8000

API endpoints

- GET /
  - Returns API metadata (name & version).

- POST /bmi
  - Accepts JSON body: `{ "weight": <kg>, "height": <m> }`
  - Returns JSON: `{ "bmi": <number>, "category": "<string>" }`


Repository files of interest

- `app.py`  FastAPI application 
- `bmi.py`  Logic (calculate_bmi, bmi_category)
- `requirements.txt`  runtime dependencies




