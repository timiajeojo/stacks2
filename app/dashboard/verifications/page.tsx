"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot, orderBy, query, Timestamp } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";
import {
  Menu,
  ChevronDown,
  Search,
  Mail,
  Copy,
  Check,
  Timer,
  CheckCircle2,
  AlertCircle,
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

type RentalStatus = "waiting" | "received" | "expired" | "refunded";

type Rental = {
  id: string;
  number: string;
  country: string;
  countryCode: string;
  service: string;
  status: RentalStatus;
  otpsReceived: number;
  lastCode: string | null;
  purchasedAt: Timestamp | null;
  expiresAt: number | null;
};

const statusOptions: { value: RentalStatus; label: string; icon: any }[] = [
  { value: "waiting", label: "Waiting", icon: Timer },
  { value: "received", label: "Received", icon: CheckCircle2 },
  { value: "expired", label: "Expired", icon: AlertCircle },
  { value: "refunded", label: "Refunded", icon: XCircle },
];

function formatTimeLeft(expiresAt: number | null, now: number): string {
  if (!expiresAt) return "—";
  const diff = Math.max(0, Math.floor((expiresAt - now) / 1000));
  if (diff <= 0) return "Expired";
  const h = String(Math.floor(diff / 3600)).padStart(2, "0");
  const m = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
  const s = String(diff % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

function formatRentedAt(ts: Timestamp | null): string {
  if (!ts) return "—";
  return ts.toDate().toLocaleString("en-NG", {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function VerificationsPage() {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [communityDismissed, setCommunityDismissed] = useState(false);
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);

  const [rentals, setRentals] = useState<Rental[]>([]);
  const [now, setNow] = useState(Date.now());

  const [search, setSearch] = useState("");
  const [statusOpen, setStatusOpen] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<RentalStatus | "all">("all");
  const [serviceFilter, setServiceFilter] = useState("all");

  const [copiedNumberId, setCopiedNumberId] = useState<string | null>(null);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const rentalListRef = useRef<HTMLDivElement>(null);
  const filterRowRef = useRef<HTMLDivElement>(null);

  // Auth guard + live rental data
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/auth");
        return;
      }
      const q = query(
        collection(db, "users", user.uid, "rentals"),
        orderBy("purchasedAt", "desc")
      );
      const unsubRentals = onSnapshot(q, (snap) => {
        setRentals(
          snap.docs.map((d) => ({ id: d.id, ...d.data() } as Rental))
        );
      });
      return () => unsubRentals();
    });
    return () => unsub();
  }, [router]);

  // Live countdown ticker
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Poll for codes on any still-waiting rentals, every 25s
  useEffect(() => {
    const interval = setInterval(async () => {
      const user = auth.currentUser;
      if (!user) return;
      const waiting = rentals.filter((r) => r.status === "waiting");
      if (waiting.length === 0) return;

      const token = await user.getIdToken();
      waiting.forEach((r) => {
        fetch(`/api/smspool/check?rentalId=${r.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }).catch(() => {});
      });
    }, 25000);
    return () => clearInterval(interval);
  }, [rentals]);

  // Outside-click closes popovers/dropdowns (containment-based, not stopPropagation)
  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      const target = e.target as Node;
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

  function copyNumber(id: string, number: string) {
    navigator.clipboard.writeText(number).catch(() => {});
    setCopiedNumberId(id);
    setTimeout(() => setCopiedNumberId(null), 1500);
  }

  function copyCode(id: string, code: string) {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 1500);
  }

  // Service list built only from services the user has actually purchased
  const serviceOptions = [
    "all",
    ...Array.from(new Set(rentals.map((r) => r.service))),
  ];

  const filteredRentals = rentals.filter((r) => {
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (serviceFilter !== "all" && r.service !== serviceFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const haystack = `${r.number} ${r.service} ${r.country}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  return (
    <div>
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
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by number, service, or country…"
              style={{
                background: "none",
                border: "none",
                outline: "none",
                color: "var(--paper)",
                fontSize: "13.5px",
                width: "100%",
                fontFamily: "inherit",
              }}
            />
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
                {statusFilter === "all"
                  ? "All Status"
                  : statusOptions.find((s) => s.value === statusFilter)?.label}
                <ChevronDown className="chev" size={14} />
              </div>
              {statusOpen && (
                <div className="filter-menu">
                  <div
                    className={`filter-menu-item ${statusFilter === "all" ? "selected" : ""}`}
                    onClick={() => {
                      setStatusFilter("all");
                      setStatusOpen(false);
                    }}
                  >
                    <div className="left">All Status</div>
                    {statusFilter === "all" && <Check size={14} className="check" />}
                  </div>
                  {statusOptions.map((opt) => (
                    <div
                      key={opt.value}
                      className={`filter-menu-item ${statusFilter === opt.value ? "selected" : ""}`}
                      onClick={() => {
                        setStatusFilter(opt.value);
                        setStatusOpen(false);
                      }}
                    >
                      <div className="left">
                        <opt.icon size={15} />
                        {opt.label}
                      </div>
                      {statusFilter === opt.value && <Check size={14} className="check" />}
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
                <div className="filter-menu">
                  {serviceOptions.map((service) => (
                    <div
                      key={service}
                      className={`filter-menu-item ${serviceFilter === service ? "selected" : ""}`}
                      onClick={() => {
                        setServiceFilter(service);
                        setServiceOpen(false);
                      }}
                    >
                      <div className="left">
                        {service === "all" ? "All Services" : service}
                      </div>
                      {serviceFilter === service && <Check size={14} className="check" />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {!communityDismissed && (
            <div className="community-card">
              <button className="close" onClick={() => setCommunityDismissed(true)}>
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
            {filteredRentals.length === 0 ? (
              <div style={{ color: "var(--paper-dim)", fontSize: "13.5px", textAlign: "center", padding: "32px 0" }}>
                {rentals.length === 0
                  ? "You haven't rented any numbers yet."
                  : "No rentals match your filters."}
              </div>
            ) : (
              filteredRentals.map((r) => (
                <div className="rental-card" key={r.id}>
                  <div className="rc-top">
                    <div className="rc-flag">📱</div>
                    <div className="rc-meta">
                      <div className="rc-number mono">{r.number}</div>
                      <div className="rc-country">{r.country}</div>
                    </div>
                    <div className="rc-actions">
                      <button
                        className={`icon-sq sms-btn ${r.lastCode ? "" : "empty"}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenPopoverId(openPopoverId === r.id ? null : r.id);
                        }}
                      >
                        {r.lastCode && <span className="ping" />}
                        <Mail size={15} />
                        {openPopoverId === r.id && (
                          <div className="sms-pop open">
                            {r.lastCode ? (
                              <>
                                <div className="lbl">MESSAGE RECEIVED</div>
                                <div
                                  className="code"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    copyCode(r.id, r.lastCode!);
                                  }}
                                >
                                  {r.lastCode}
                                </div>
                                <div className={`time ${copiedCodeId === r.id ? "copied-note" : ""}`}>
                                  {copiedCodeId === r.id ? "Copied to clipboard ✓" : "Tap code to copy"}
                                </div>
                              </>
                            ) : r.status === "refunded" ? (
                              <>
                                <div className="lbl">REFUNDED</div>
                                <div className="empty-txt">
                                  No code arrived — this order was refunded.
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
                    <span
                      className={`tag ${
                        r.status === "received"
                          ? "active"
                          : r.status === "waiting"
                          ? "service"
                          : "inactive"
                      }`}
                    >
                      {statusOptions.find((s) => s.value === r.status)?.label || r.status}
                    </span>
                  </div>

                  <div className="rc-stats">
                    <div className="rc-stat">
                      <div className="lbl">OTPs Received</div>
                      <div className="val">{r.otpsReceived}</div>
                    </div>
                    <div className="rc-stat">
                      <div className="lbl">Expires In</div>
                      <div className="val exp mono">
                        <Timer size={13} />
                        {formatTimeLeft(r.expiresAt, now)}
                      </div>
                    </div>
                  </div>

                  <div className="rc-footer">
                    <div className="lbl">Rented At</div>
                    <div className="val">{formatRentedAt(r.purchasedAt)}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
