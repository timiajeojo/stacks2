"use client";

import { useEffect, useRef, useState } from "react";
import {
  Menu,
  ChevronDown,
  Search,
  Mail,
  Copy,
  Check,
  Timer,
  Circle,
  CheckCircle2,
  Info,
  AlertTriangle,
  XCircle,
  LayoutGrid,
  ArrowDownToLine,
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

const statusOptions = [
  { value: "all", label: "All Status", icon: null },
  { value: "created", label: "Created", icon: Circle },
  { value: "pending", label: "Pending", icon: Timer },
  { value: "active", label: "Active", icon: CheckCircle2 },
  { value: "inactive", label: "Inactive", icon: Info },
  { value: "expired", label: "Expired", icon: AlertTriangle },
  { value: "cancelled", label: "Cancelled", icon: XCircle },
];

export default function VerificationsPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [communityDismissed, setCommunityDismissed] = useState(false);
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);
  const [statusOpen, setStatusOpen] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [copiedNumberId, setCopiedNumberId] = useState<string | null>(null);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const rentalListRef = useRef<HTMLDivElement>(null);
  const filterRowRef = useRef<HTMLDivElement>(null);

  // Derived from the numbers the user has actually purchased — once real
  // data is wired up this will reflect their real rentals automatically.
  const serviceOptions = [
    "all",
    ...Array.from(new Set(rentals.map((r) => r.service))),
  ];

  function copyNumber(id: string, number: string) {
    navigator.clipboard.writeText(number).catch(() => {});
    setCopiedNumberId(id);
    setTimeout(() => setCopiedNumberId(null), 1500);
  }

  function copyCode(id: string, code: string) {
    navigator.clipboard.writeText(code.replace(/\s/g, "")).catch(() => {});
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 1500);
  }

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      const target = e.target as Node;
      // Only close if the click genuinely landed outside these containers —
      // fixes a bug where every click (including the one that opened a
      // popover/dropdown) was immediately closing it again.
      if (rentalListRef.current && !rentalListRef.current.contains(target)) {
        setOpenPopoverId(null);
      }
      if (filterRowRef.current && !filterRowRef.current.contains(target)) {
        setStatusOpen(false);
        setServiceOpen(false);
      }
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
          <div className="filter-row" ref={filterRowRef}>
            <div className="filter-wrap">
              <div
                className="filter-select"
                onClick={(e) => {
                  e.stopPropagation();
                  setServiceOpen(false);
                  setStatusOpen((v) => !v);
                }}
              >
                {statusOptions.find((s) => s.value === statusFilter)?.label}
                <ChevronDown className="chev" size={14} />
              </div>
              {statusOpen && (
                <div className="filter-menu" onClick={(e) => e.stopPropagation()}>
                  {statusOptions.map((opt) => (
                    <div
                      key={opt.value}
                      className={`filter-menu-item ${
                        statusFilter === opt.value ? "selected" : ""
                      }`}
                      onClick={() => {
                        setStatusFilter(opt.value);
                        setStatusOpen(false);
                      }}
                    >
                      <div className="left">
                        {opt.icon && <opt.icon size={15} />}
                        {opt.label}
                      </div>
                      {statusFilter === opt.value && (
                        <Check size={14} className="check" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="filter-wrap">
              <div
                className="filter-select"
                onClick={(e) => {
                  e.stopPropagation();
                  setStatusOpen(false);
                  setServiceOpen((v) => !v);
                }}
              >
                {serviceFilter === "all" ? "All Services" : serviceFilter}
                <ChevronDown className="chev" size={14} />
              </div>
              {serviceOpen && (
                <div className="filter-menu" onClick={(e) => e.stopPropagation()}>
                  {serviceOptions.map((service) => (
                    <div
                      key={service}
                      className={`filter-menu-item ${
                        serviceFilter === service ? "selected" : ""
                      }`}
                      onClick={() => {
                        setServiceFilter(service);
                        setServiceOpen(false);
                      }}
                    >
                      <div className="left">
                        {service === "all" ? "All Services" : service}
                      </div>
                      {serviceFilter === service && (
                        <Check size={14} className="check" />
                      )}
                    </div>
                  ))}
                </div>
              )}
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

          <div className="rental-list" ref={rentalListRef}>
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
                              <div
                                className="code"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyCode(r.id, r.message!.code);
                                }}
                              >
                                {r.message.code}
                              </div>
                              <div
                                className={`time ${
                                  copiedCodeId === r.id ? "copied-note" : ""
                                }`}
                              >
                                {copiedCodeId === r.id
                                  ? "Copied to clipboard ✓"
                                  : r.message.time}
                              </div>
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
                    <button
                      className="icon-sq"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyNumber(r.id, r.number);
                      }}
                    >
                      {copiedNumberId === r.id ? (
                        <Check size={14} color="var(--teal)" />
                      ) : (
                        <Copy size={14} />
                      )}
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
