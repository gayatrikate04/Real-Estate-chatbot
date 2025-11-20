"use client";

import React, { useState } from "react";
import { FiCopy } from "react-icons/fi";

export default function SummaryCard({ text }) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      console.error("copy failed", e);
    }
  };

  // small naive sentiment / tag detector
  const tags = [];
  if (text) {
    if (/(rise|growing|increasing|upward)/i.test(text)) tags.push("Price Rising");
    if (/(fall|decline|decreasing|downward)/i.test(text)) tags.push("Price Falling");
    if (/(stable|stable\/declining|stable decline)/i.test(text)) tags.push("Stable");
  }

  return (
    <div style={{
      maxWidth: 1100,
      margin: "24px auto",
      background: "rgba(255,255,255,0.02)",
      border: "1px solid rgba(255,255,255,0.04)",
      padding: 18,
      borderRadius: 12,
      boxShadow: "0 8px 28px rgba(2,6,15,0.6)"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <h5 style={{ margin: 0, marginBottom: 8 }}>Summary</h5>
          <p style={{ margin: 0, color: "rgba(223,236,255,0.9)" }}>{text}</p>

          {tags.length > 0 && (
            <div style={{ marginTop: 10 }}>
              {tags.map(t => (
                <span key={t} style={{
                  display: "inline-block",
                  marginRight: 8,
                  padding: "6px 8px",
                  borderRadius: 999,
                  background: "rgba(167,199,231,0.06)",
                  color: "#DDEEFF",
                  fontSize: 13
                }}>{t}</span>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
          <button
            onClick={onCopy}
            title="Copy summary"
            className="btn"
            style={{
              background: "linear-gradient(135deg,#7cc7ff,#b7a6ff)",
              border: "none",
              color: "#041224",
              padding: 8,
              borderRadius: 10,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 20px rgba(10,20,40,0.25)",
              cursor: "pointer"
            }}
          >
            <FiCopy size={16} />
          </button>
          <div style={{ fontSize: 12, color: "rgba(223,236,255,0.6)" }}>
            {copied ? "Copied!" : "Copy"}
          </div>
        </div>
      </div>
    </div>
  );
}
