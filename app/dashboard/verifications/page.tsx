 "use client";

import { useEffect, useRef, useState } from "react";
import {
  Menu,
  ChevronDown,
  Search,
  Mail,
  Copy,
  Timer,
  LayoutGrid,
  ArrowDownToLine,
  CheckCircle2,
  Package,
  X,
  Send,
  MessageSquareCode,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { label: "Deposits", href: "/dashboard/deposits", icon: ArrowDownToLine },
  { label: "Verifications", href: "/dashboard/verifications", icon: CheckCircle2, active: true },
  { label: "Rentals", href: "/dashboard/rentals", icon: Package },
];

type Rental = {
  id: string;
  flag: string;
  number: string;
  country: string;
  service: string;
  status: "active" | "inactive";
  otps: number;
  expiresIn: string;
  rentedAt: string;
  message: { code: string; time: string } | null;
};

const rentals: Rental[] = [
  {
    id: "1",
    flag: "🇳🇬",
    number: "+234 812 040 331",
    country: "Nigeria",
    service: "WHATSAPP",
    status: "active",
    otps: 1,
    expiresIn: "08:42:11",
    rentedAt: "Today 9:03 AM",
    message: { code: "482 917", time: "Today, 9:14 AM · 2 min ago" },
  },
  {
    id: "2",
    flag: "🇺🇸",
    number: "+1 609 728 9920",
    country: "United States",
    service: "SIGNAL",
    status: "active",
    otps: 0,
    expiresIn: "04:58:02",
    rentedAt: "Today 8:41 AM",
    message: null,
  },
  {
    id: "3",
    flag: "🇬🇧",
    number: "+44 771 290 5578",
    country: "United Kingdom",
    service: "GOOGLE",
    status: "inactive",
    otps: 1,
    expiresIn: "00:00:00",
    rentedAt: "Yesterday 7:02 PM",
    message: { code: "216 590", time: "Yesterday, 7:12 PM" },
  },
];

export default function VerificationsPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [communityDismissed, setCommunityDismissed] = useState(false);
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick() {
      setOpenPopoverId(null);
    }
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  return (
    <div ref={wrapRef}>
      <div
        className={`dashboard-backdrop ${drawerOpen ? "open" : ""}`}
        onClick={() => setDrawerOpen(false)}
      />

      <nav className={`drawer ${drawerOpen ? "open" : ""}`}>
        <div className="drawer-brand">
          <div className="logo-mark">
            <MessageSquareCode size={16} strokeWidth={2.5} />
          </div>
          <span>stacksnumber</span>
        </div>

        <div className="drawer-label">NAVIGATION</div>
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={`drawer-item ${item.active ? "active" : ""}`}
          >
            <div className="left">
              <item.icon size={18} />
              {item.label}
            </div>
            {item.active && <span className="dot" />}
          </a>
        ))}

        <div className="drawer-bottom">
          <div className="drawer-user">
            <div className="left">
              <div className="avatar">T</div>
              <div className="name">Timi</div>
            </div>
            <ChevronDown size={16} color="var(--paper-dim)" />
          </div>
        </div>
      </nav>

      <div className="dashboard-app">
        <div className="topbar">
          <button className="icon-btn" onClick={() => setDrawerOpen(true)}>
            <Menu size={17} />
          </button>
          <div className="logo">
            <span className="logo-mark">
              <MessageSquareCode size={12} strokeWidth={2.5} />
            </span>
            stacksnumber
          </div>
          <div className="icon-btn">T</div>
        </div>

        <div className="page-head">
          <h1>Verifications</h1>
          <p>View and manage your phone verifications.</p>
        </div>

        <main className="dashboard-main">
          <a
            href="/dashboard/buy-number"
            className="btn-purchase enabled"
            style={{ marginBottom: "14px", textDecoration: "none" }}
          >
            + Purchase New Verification
          </a>

          <div className="search-box">
            <Search size={14} />
            Search by number, service, or country…
          </div>
          <div className="filter-row">
            <div className="filter-select">
              All Status <ChevronDown className="chev" size={14} />
            </div>
            <div className="filter-select">
              All Services <ChevronDown className="chev" size={14} />
            </div>
          </div>

          {!communityDismissed && (
            <div className="community-card">
              <button
                className="close"
                onClick={() => setCommunityDismissed(true)}
              >
                <X size={14} />
              </button>
              <p>
                Make sure to join our Telegram channel for customer support
                and quick updates on available numbers.
              </p>
              <button className="telegram-btn">
                <Send size={14} />
                Join Telegram Channel →
              </button>
            </div>
          )}

          <div className="rental-list">
            {rentals.map((r) => (
              <div className="rental-card" key={r.id}>
                <div className="rc-top">
                  <div className="rc-flag">{r.flag}</div>
                  <div className="rc-meta">
                    <div className="rc-number mono">{r.number}</div>
                    <div className="rc-country">{r.country}</div>
                  </div>
                  <div className="rc-actions">
                    <button
                      className={`icon-sq sms-btn ${r.message ? "" : "empty"}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenPopoverId(
                          openPopoverId === r.id ? null : r.id
                        );
                      }}
                    >
                      {r.message && <span className="ping" />}
                      <Mail size={15} />
                      {openPopoverId === r.id && (
                        <div className="sms-pop open">
                          {r.message ? (
                            <>
                              <div className="lbl">MESSAGE RECEIVED</div>
                              <div className="code">{r.message.code}</div>
                              <div className="time">{r.message.time}</div>
                            </>
                          ) : (
                            <>
                              <div className="lbl">MESSAGE STATUS</div>
                              <div className="empty-txt">
                                No messages yet — waiting for the code.
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </button>
                    <button className="icon-sq">
                      <Copy size={14} />
                    </button>
                  </div>
                </div>

                <div className="rc-tags">
                  <span className="tag service">{r.service}</span>
                  <span className={`tag ${r.status}`}>
                    {r.status === "active" ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="rc-stats">
                  <div className="rc-stat">
                    <div className="lbl">OTPs Received</div>
                    <div className="val">{r.otps}</div>
                  </div>
                  <div className="rc-stat">
                    <div className="lbl">Expires In</div>
                    <div className="val exp mono">
                      <Timer size={13} />
                      {r.expiresIn}
                    </div>
                  </div>
                </div>

                <div className="rc-footer">
                  <div className="lbl">Rented At</div>
                  <div className="val">{r.rentedAt}</div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
