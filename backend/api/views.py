# backend/api/views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .utils import load_dataset, filter_by_area, group_trend, parse_query
import numpy as np
from rest_framework.parsers import MultiPartParser
from django.conf import settings
from pathlib import Path

@api_view(["POST"])
def analyze(request):
    query = request.data.get("query", "")
    if not query:
        return Response({"error": "Query is required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        df = load_dataset()
    except Exception as e:
        return Response({"error": f"Error loading dataset: {str(e)}"}, status=500)

    parsed = parse_query(query)
    intent = parsed.get("intent")

    if intent == "analyze":
        area = parsed.get("area")
        filtered = filter_by_area(df, area)
        if filtered.empty:
            return Response({"error": f"No data found for area '{area}'."}, status=404)
        chart_df = group_trend(filtered)
        summary = generate_mock_summary(area, filtered, chart_df)
        return Response({
            "area": area.title(),
            "summary": summary,
            "chartData": chart_df.fillna(0).to_dict(orient="records"),
            "tableData": filtered.fillna("").to_dict(orient="records")
        })

    if intent == "compare":
        a1, a2 = parsed.get("areas", ["", ""])
        metric = parsed.get("metric", "demand")
        f1 = filter_by_area(df, a1)
        f2 = filter_by_area(df, a2)
        if f1.empty or f2.empty:
            return Response({"error": "One or both areas not found."}, status=404)
        t1 = group_trend(f1).rename(columns={"Price":"Price1","Demand":"Demand1"})
        t2 = group_trend(f2).rename(columns={"Price":"Price2","Demand":"Demand2"})
        merged = t1.merge(t2, on="Year", how="outer").sort_values("Year").fillna(0)
        chart = []
        for _, row in merged.iterrows():
            chart.append({
                "Year": int(row["Year"]),
                f"{a1.title()}_{metric.title()}": float(row.get(f"{metric.title()}1", 0) if metric=="price" else row.get("Demand1",0)),
                f"{a2.title()}_{metric.title()}": float(row.get(f"{metric.title()}2", 0) if metric=="price" else row.get("Demand2",0))
            })
        summary = f"Comparison of {a1.title()} and {a2.title()} on {metric.title()}."
        return Response({"summary": summary, "chartData": chart, "tableData": []})

    if intent == "growth":
        area = parsed.get("area")
        years = parsed.get("years") or 3
        filtered = filter_by_area(df, area)
        if filtered.empty:
            return Response({"error": f"No data found for area '{area}'."}, status=404)
        chart_df = group_trend(filtered)
        years_sorted = sorted(chart_df["Year"].dropna().unique())
        if len(years_sorted) == 0:
            return Response({"error": "No year data."}, status=400)
        cutoff = max(years_sorted) - years + 1
        last_df = chart_df[chart_df["Year"] >= cutoff]
        if not last_df.empty and last_df["Price"].notna().sum() >= 2:
            first = last_df.iloc[0]["Price"]
            last = last_df.iloc[-1]["Price"]
            growth_pct = ((last - first) / first) * 100 if first else 0
        else:
            growth_pct = 0
        summary = f"{area.title()} price change over last {years} years is {growth_pct:.2f}%."
        return Response({
            "area": area.title(),
            "summary": summary,
            "chartData": last_df.fillna(0).to_dict(orient="records"),
            "tableData": filtered.fillna("").to_dict(orient="records")
        })

    return Response({"error": "Could not understand query."}, status=400)


def generate_mock_summary(area: str, filtered_df, chart_df):
    avg_price = filtered_df["Price"].mean()
    avg_demand = filtered_df["Demand"].mean()
    recent = chart_df.sort_values("Year").tail(1)
    recent_price = recent["Price"].iloc[0] if not recent.empty else None
    trend = "rising" if recent_price and recent_price > avg_price else "stable/declining"
    if recent_price is not None:
        return (f"{area.title()} shows {trend} price trend. Average price: {avg_price:.0f}. "
                f"Average demand index: {avg_demand:.1f}. Recent price: {recent_price:.0f}.")
    else:
        return f"{area.title()} data summary: avg price {avg_price:.0f}, avg demand {avg_demand:.1f}."

@api_view(["POST"])
def upload_dataset(request):
    parser_classes = (MultiPartParser,)
    file_obj = request.FILES.get("file")
    if not file_obj:
        return Response({"error": "No file uploaded."}, status=400)
    data_dir = Path(settings.BASE_DIR) / "data"
    data_dir.mkdir(exist_ok=True)
    target = data_dir / "realestate.xlsx"
    with open(target, "wb+") as f:
        for chunk in file_obj.chunks():
            f.write(chunk)
    # clear cached loader
    try:
        load_dataset.cache_clear()
    except Exception:
        pass
    return Response({"message": "File uploaded."})
