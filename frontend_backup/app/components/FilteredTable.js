"use client";

import React, { useMemo } from "react";
import { FiDownload } from "react-icons/fi";

/** Format number nicely */
function fmt(n) {
  if (n == null) return "";
  if (typeof n === "number") return n.toLocaleString();
  // try parse
  const p = Number(n);
  if (!Number.isNaN(p)) return p.toLocaleString();
  return n;
}

/** Convert rows -> CSV and trigger download */
function downloadCSV(rows, filename = "filtered_data.csv") {
  if (!rows || !rows.length) return;
  const keys = Object.keys(rows[0]);
  const csv = [
    keys.join(","),
    ...rows.map(r => keys.map(k => {
      const v = r[k] ?? "";
      // escape quotes
      const s = String(v).replace(/"/g, '""');
      return `"${s}"`;
    }).join(","))
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function FilteredTable({ rows }) {
  if (!rows || !rows.length) return null;

  // pick columns to show (prefer common ones)
  const cols = useMemo(() => {
    const all = Object.keys(rows[0]);
    const desired = ["Year", "Area", "city", "Price", "Demand"];
    // include desired if present
    const chosen = desired.filter(c => all.includes(c));
    // then add up to 5 more columns from the dataset excluding chosen
    for (const c of all) {
      if (chosen.length >= 8) break;
      if (!chosen.includes(c)) chosen.push(c);
    }
    return chosen;
  }, [rows]);

  return (
    <div style={{
      maxWidth: 1100,
      margin: "10px auto 56px",
      padding: 12,
      borderRadius: 12,
      background: "rgba(255,255,255,0.015)",
      border: "1px solid rgba(255,255,255,0.03)"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <h5 style={{ margin: 0 }}>Filtered Data</h5>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => downloadCSV(rows)}
            style={{
              border: "none",
              background: "linear-gradient(135deg,#7cc7ff,#b7a6ff)",
              color: "#041224",
              padding: "8px 10px",
              borderRadius: 10,
              display: "inline-flex",
              gap: 8,
              alignItems: "center",
              cursor: "pointer"
            }}
            title="Download CSV"
          >
            <FiDownload /> Download CSV
          </button>
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className="table table-sm" style={{ color: "#DDEFFF", minWidth: 800 }}>
          <thead>
            <tr>
              {cols.map(c => <th key={c} style={{ color: "rgba(223,236,255,0.6)" }}>{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={idx}>
                {cols.map(c => <td key={c}>{c === "Price" ? fmt(Number(r[c])) : fmt(r[c])}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
