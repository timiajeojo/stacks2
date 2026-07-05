"use client";

import { useMemo } from "react";

const SERVICES = [
  { name: "WhatsApp", icon: "W", bg: "#1f3d2e", fg: "#45D9B8" },
  { name: "Telegram", icon: "T", bg: "#1c3350", fg: "#5aa9e6" },
  { name: "Google", icon: "G", bg: "#122a4d", fg: "#8fc0ff" },
  { name: "Instagram", icon: "I", bg: "#3d1f38", fg: "#e06bb8" },
  { name: "Discord", icon: "D", bg: "#241f3d", fg: "#8c7ae6" },
  { name: "TikTok", icon: "Tk", bg: "#1a1a1a", fg: "#e8e8e8" },
  { name: "Amazon", icon: "A", bg: "#3d2d1a", fg: "#e6a13a" },
  { name: "Uber", icon: "U", bg: "#1a1a1a", fg: "#e8e8e8" },
];

const COUNTRIES = ["+234", "+1", "+44", "+91", "+254", "+27", "+971", "+33"];

function maskNumber(cc: string) {
  const rest = Array.from({ length: 7 }, () =>
    Math.floor(Math.random() * 10)
  ).join("");
  return `${cc} •• ${rest.slice(0, 3)} ${rest.slice(3)}`;
}

function genCode() {
  return Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join(
    ""
  );
}

type Row = {
  service: (typeof SERVICES)[number];
  numb: string;
  code: string;
};

function buildRows(count: number): Row[] {
  return Array.from({ length: count }, () => {
    const service = SERVICES[Math.floor(Math.random() * SERVICES.length)];
    const cc = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
    return { service, numb: maskNumber(cc), code: genCode() };
  });
}

export default function Ticker() {
  // Generated once on mount; duplicated so the CSS loop (-50%) is seamless.
  const rows = useMemo(() => {
    const base = buildRows(16);
    return [...base, ...base];
  }, []);

  return (
    <div className="ticker-panel">
      <div className="ticker-head">
        <span className="title">INCOMING</span>
        <span className="live-badge">
          <span className="pulse"></span>LIVE
        </span>
      </div>
      <div className="ticker-body">
        <div className="tick-list">
          {rows.map((row, i) => (
            <div className="tick-row" key={i}>
              <div
                className="svc-icon"
                style={{ background: row.service.bg, color: row.service.fg }}
              >
                {row.service.icon}
              </div>
              <div className="tick-meta">
                <div className="svc">{row.service.name}</div>
                <div className="numb">{row.numb}</div>
              </div>
              <div className="tick-code">{row.code}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
