from __future__ import annotations

from dataclasses import dataclass
from math import erf, sqrt, log
from pathlib import Path
from typing import Dict, List, Optional, Tuple
import csv


DATA_DIR = Path(__file__).parent / "data"


@dataclass
class LMS:
    age_months: float
    L: float
    M: float
    S: float


_LMS_TABLE: Dict[str, List[LMS]] | None = None  # keys: "male" | "female"


def _try_load_cdc_csv() -> Optional[Dict[str, List[LMS]]]:
    candidates = [DATA_DIR / "bmiagerev.csv", DATA_DIR / "BMIagerev.csv", DATA_DIR / "bmiagerev.txt"]
    for path in candidates:
        if path.exists():
            lms: Dict[str, List[LMS]] = {"male": [], "female": []}
            with path.open("r", newline="", encoding="utf-8-sig") as f:
                reader = csv.DictReader(f)
                # Normalize fieldnames
                field_map = {k.lower(): k for k in reader.fieldnames or []}
                def col(name: str) -> str:
                    return field_map.get(name.lower(), name)
                sex_key = col("sex")
                age_key = col("agemos")
                L_key = col("l")
                M_key = col("m")
                S_key = col("s")
                for row in reader:
                    try:
                        sex_raw = str(row[sex_key]).strip()
                        sex = "male" if sex_raw in {"1", "M", "m", "male", "Male"} else "female"
                        agemos = float(row[age_key])
                        L = float(row[L_key])
                        M = float(row[M_key])
                        S = float(row[S_key])
                        lms[sex].append(LMS(age_months=agemos, L=L, M=M, S=S))
                    except Exception:
                        # Skip malformed rows
                        continue
            # Ensure sorted by age
            for sex in ("male", "female"):
                lms[sex].sort(key=lambda x: x.age_months)
            return lms
    return None


def _ensure_loaded() -> None:
    global _LMS_TABLE
    if _LMS_TABLE is not None:
        return
    # Attempt to load from CSV in data dir
    _LMS_TABLE = _try_load_cdc_csv()


def _interpolate_lms(age_months: float, sex: str) -> Optional[LMS]:
    _ensure_loaded()
    if _LMS_TABLE is None:
        return None
    sex_key = "male" if str(sex).strip().lower().startswith("m") else "female"
    rows = _LMS_TABLE.get(sex_key)
    if not rows:
        return None
    # Outside range
    if age_months < rows[0].age_months or age_months > rows[-1].age_months:
        return None
    # Exact match or boundaries
    for i, r in enumerate(rows):
        if abs(r.age_months - age_months) < 1e-9:
            return r
        if r.age_months > age_months:
            # Interpolate between rows[i-1] and rows[i]
            r0 = rows[i - 1]
            r1 = r
            t = (age_months - r0.age_months) / (r1.age_months - r0.age_months)
            L = r0.L + t * (r1.L - r0.L)
            M = r0.M + t * (r1.M - r0.M)
            S = r0.S + t * (r1.S - r0.S)
            return LMS(age_months=age_months, L=L, M=M, S=S)
    # Fallback
    return rows[-1]


def _z_from_bmi(bmi: float, L: float, M: float, S: float) -> float:
    if L == 0:
        return log(bmi / M) / S
    return ((bmi / M) ** L - 1.0) / (L * S)


def _normal_cdf(z: float) -> float:
    # Standard normal CDF using math.erf
    return 0.5 * (1.0 + erf(z / sqrt(2.0)))


def bmi_percentile_for_age(bmi: float, age_years: float, sex: str) -> Optional[float]:
    if age_years is None or sex is None:
        return None
    try:
        age_months = float(age_years) * 12.0
    except Exception:
        return None
    lms = _interpolate_lms(age_months, sex)
    if lms is None:
        return None
    z = _z_from_bmi(bmi, lms.L, lms.M, lms.S)
    p = _normal_cdf(z) * 100.0
    # Clamp to [0, 100]
    if p < 0:
        p = 0.0
    if p > 100:
        p = 100.0
    return p


def pediatric_bmi_category(percentile: float) -> str:

    if percentile < 5.0:
        return "Under Weight"
    if percentile < 85.0:
        return "Normal Weight"
    if percentile < 95.0:
        return "Over Weight"
    return "Obese"
