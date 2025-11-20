import pandas as pd
import re
from pathlib import Path
from functools import lru_cache
from typing import Optional

DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "realestate.xlsx"

# Column mapping for your actual file
COLUMN_MAP = {
    "final location": "Area",
    "year": "Year",
    "total_sales - igr": "Price",
    "total sold - igr": "Demand"
}

@lru_cache(maxsize=1)
def load_dataset(path: Optional[str] = None) -> pd.DataFrame:
    p = DATA_PATH if path is None else Path(path)

    df = pd.read_excel(p, sheet_name=0, engine="openpyxl")

    # Normalize column names
    df.columns = [str(c).strip().lower() for c in df.columns]

    # Rename columns as per COLUMN_MAP
    rename_map = {}
    for col in df.columns:
        if col in COLUMN_MAP:
            rename_map[col] = COLUMN_MAP[col]

    df = df.rename(columns=rename_map)

    # Check required columns
    required = ["Area", "Year", "Price", "Demand"]
    for col in required:
        if col not in df.columns:
            raise ValueError(f"Required column '{col}' missing after mapping.")

    # Convert types
    df["Year"] = pd.to_numeric(df["Year"], errors="coerce").astype("Int64")
    df["Price"] = pd.to_numeric(df["Price"], errors="coerce")
    df["Demand"] = pd.to_numeric(df["Demand"], errors="coerce")
    df["Area"] = df["Area"].astype(str).str.strip()

    return df


def filter_by_area(df: pd.DataFrame, area: str) -> pd.DataFrame:
    return df[df["Area"].str.contains(area, case=False, na=False)]


def group_trend(df: pd.DataFrame) -> pd.DataFrame:
    grouped = df.groupby("Year", as_index=False).agg({"Price": "mean", "Demand": "mean"})
    grouped = grouped.sort_values("Year")
    return grouped


def parse_query(query: str):
    q = query.lower()
    compare = re.search(r"compare\s+(.+?)\s+and\s+(.+?)(?:\s|$)", q)
    if compare:
        a1 = compare.group(1).strip()
        a2 = compare.group(2).strip()
        metric = "demand"
        if "price" in q:
            metric = "price"
        return {"intent": "compare", "areas": [a1, a2], "metric": metric}

    growth = re.search(r"over the last\s+(\d+)\s+years", q)
    if "price growth" in q or "growth" in q:
        area = re.search(r"for\s+([a-zA-Z\s]+?)(?:\s+over|\s*$)", q)
        area_name = area.group(1).strip() if area else ""
        years = int(growth.group(1)) if growth else None
        return {"intent": "growth", "area": area_name, "years": years}

    m = re.search(r"(analyze|analysis of|analysis for)\s+([a-zA-Z\s]+)$", q)
    if m:
        return {"intent": "analyze", "area": m.group(2).strip()}

    return {"intent": "analyze", "area": query.strip()}
