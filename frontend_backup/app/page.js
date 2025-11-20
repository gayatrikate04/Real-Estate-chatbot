// frontend/app/page.js
"use client";

import React, { useState } from "react";
import QueryInput from "./components/QueryInput";
import SummaryCard from "./components/SummaryCard";
import TrendChart from "./components/TrendChart";
import FilteredTable from "./components/FilteredTable";
import "./globals.css";
import { analyzeQuery } from "./lib/api";

export default function Page() {
  const [summary, setSummary] = useState("");
  const [chartData, setChartData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async (q) => {
    if (!q || !q.trim()) return;
    setLoading(true);
    setError("");
    setSummary("");
    setChartData([]);
    setTableData([]);

    try {
      const data = await analyzeQuery(q); // expects { summary, chartData, tableData }
      setSummary(data.summary || "No summary returned.");
      setChartData(Array.isArray(data.chartData) ? data.chartData : []);
      setTableData(Array.isArray(data.tableData) ? data.tableData : []);
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.error || err?.message || "Could not fetch analysis — try again.";
      setError(msg);
      setSummary("");
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setError("");
    setSummary("");
    setChartData([]);
    setTableData([]);
  };

  return (
    <div className="page-wrap">
      <header style={{ marginTop: 14 }}>
        <h1 className="title">Real Estate Intelligence</h1>
        <p className="subtitle">
          Ask me anything about real estate trends, prices, and market analysis.
          <br />
          Powered by advanced AI.
        </p>
      </header>

      <main style={{ width: "100%" }}>
        <QueryInput onSend={handleSend} loading={loading} />

        {loading && (
          <div style={{ maxWidth: 1100, margin: "18px auto" }}>
            <div style={{ color: "rgba(223,236,255,0.8)" }}>Loading analysis…</div>
          </div>
        )}

        {error && (
          <div style={{ maxWidth: 1100, margin: "18px auto" }}>
            <div style={{
              background: "rgba(255,100,100,0.06)",
              border: "1px solid rgba(255,100,100,0.12)",
              padding: 14,
              borderRadius: 10,
              color: "#ffdede"
            }}>
              <strong>Error:</strong> {error}
              <div style={{ marginTop: 8 }}>
                <button
                  onClick={handleRetry}
                  style={{
                    marginRight: 8,
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.06)",
                    color: "rgba(223,236,255,0.9)",
                    padding: "6px 10px",
                    borderRadius: 8,
                    cursor: "pointer"
                  }}
                >
                  Clear
                </button>
                <button
                  onClick={() => { /* optionally re-run last query if you store it */ }}
                  style={{
                    background: "linear-gradient(135deg,#7cc7ff,#b7a6ff)",
                    border: "none",
                    color: "#041224",
                    padding: "6px 10px",
                    borderRadius: 8,
                    cursor: "pointer"
                  }}
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Summary */}
        {summary && <SummaryCard text={summary} />}

        {/* Chart */}
        {chartData?.length > 0 && <TrendChart data={chartData} />}

        {/* Table */}
        {tableData?.length > 0 && <FilteredTable rows={tableData} />}
      </main>
    </div>
  );
}
