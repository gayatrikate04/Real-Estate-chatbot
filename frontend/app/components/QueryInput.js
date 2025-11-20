"use client";

import React, { useState } from "react";
import SendButton from "./SendButton";

export default function QueryInput({ onSend, loading }) {
  const [value, setValue] = useState("");

  const handleSend = () => {
    if (!value.trim() || loading) return;
    onSend(value.trim());
    // keep value or clear — I clear for better UX
    setValue("");
  };

  return (
    <div className="input-shell">
      <div className="query-box" role="search">
        <input
          className="query-input"
          placeholder="Ask about any area… (e.g., Analyze Wakad)"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={loading}
        />
        <div className="send-wrap">
          <SendButton onClick={handleSend} />
        </div>
      </div>
    </div>
  );
}
