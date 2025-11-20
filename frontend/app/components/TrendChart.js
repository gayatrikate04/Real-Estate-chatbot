"use client";

import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

/** Small currency / number formatter */
function formatNumber(v) {
  if (v == null) return "";
  const num = Number(v);
  if (Number.isNaN(num)) return v;
  // adapt for big totals
  if (Math.abs(num) >= 1e9) return `₹${(num / 1e9).toFixed(2)}B`;
  if (Math.abs(num) >= 1e7) return `₹${(num / 1e7).toFixed(2)}Cr`;
  if (Math.abs(num) >= 1e5) return `₹${(num / 1e5).toFixed(2)}L`;
  return `₹${num.toLocaleString()}`;
}

export default function TrendChart({ data, height = 340 }) {
  if (!data || !data.length) return null;

  // all keys excluding Year
  const keys = Object.keys(data[0]).filter(k => k !== "Year");

  // choose colors
  const colors = ["#A7C7E7", "#A8E6CF", "#C7B8EA", "#6C9CF0", "#FFD57E", "#90C4FF"];

  return (
    <div style={{
      maxWidth: 1100,
      margin: "10px auto 28px",
      padding: 14,
      borderRadius: 12,
      background: "rgba(255,255,255,0.015)",
      border: "1px solid rgba(255,255,255,0.03)"
    }}>
      <h5 style={{ margin: "6px 0 12px" }}>Price & Demand Trend</h5>

      <div style={{ width: "100%", height }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
            <XAxis dataKey="Year" tick={{ fill: "rgba(223,236,255,0.6)" }} />
            <YAxis tickFormatter={formatNumber} tick={{ fill: "rgba(223,236,255,0.6)" }} />
            <Tooltip formatter={(val) => typeof val === "number" ? formatNumber(val) : val} />
            <Legend />
            {keys.map((k, idx) => (
              <Line
                key={k}
                type="monotone"
                dataKey={k}
                stroke={colors[idx % colors.length]}
                strokeWidth={2}
                dot={{ r: 2 }}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
