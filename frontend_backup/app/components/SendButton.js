"use client";

import React from "react";
import { FiSend } from "react-icons/fi";

export default function SendButton({ onClick, title = "Send" }) {
  return (
    <button className="send-btn" aria-label={title} onClick={onClick} title={title}>
      <div className="icon-bg">
        <FiSend size={18} />
      </div>
    </button>
  );
}
