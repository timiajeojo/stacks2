"use client";

import { useEffect, useRef, useState } from "react";
import {
  Menu,
  ChevronDown,
  Search,
  ArrowDown,
  ArrowUp,
  Trash2,
  Check,
  CheckCircle2,
  Circle,
  Timer,
  XCircle,
  AlertCircle,
  Landmark,
  Phone,
  LayoutGrid,
  ArrowDownToLine,
  Package,
  Diamond,
  MessageSquareCode,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { label: "Deposits", href: "/dashboard/deposits", icon: ArrowDownToLine, active: true },
  { label: "Verifications", href: "/dashboard/verifications", icon: CheckCircle2 },
  { label: "Rentals", href: "/dashboard/rentals", icon: Package },
];

type Tx = {
  id: string;
  kind: "credit" | "debit";
  status: "ok" | "pending";
  method: string;
  amount: string;
  date: string;
  completed: boolean;
};

const initialTx: Tx[] = [
  { id: "1", kind: "credit", status: "ok", method: "Payment Point", amount: "+$5.20", date: "Wed, 11:28 PM", completed: true },
  { id: "2", kind: "credit", status: "ok", method: "Payment Point", amount: "+$25.00", date: "Tue, 4:02 PM", completed: true },
  { id: "3", kind: "debit", status: "ok", method: "Number rental — WhatsApp", amount: "-$0.19", date: "Tue, 11:04 AM", completed: true },
  { id: "4", kind: "credit", status: "pending", method: "Payment Point", amount: "+$10.00", date: "Mon, 9:41 AM", completed: false },
];

const statusOptions = [
  { value: "all", label: "All Status", icon: null },
  { value: "created", label: "Created", icon: Circle },
  { value: "pending", label: "Pending", icon: Timer },
  { value: "completed", label: "Completed", icon: CheckCircle2 },
  { value: "cancelled", label: "Cancelled", icon: XCircle },
  { value: "refunded", label: "Refunded", icon: AlertCircle },
];

const paymentOptions = [
  { value: "all", label: "All Payment Methods" },
  { value: "drexpay", label: "Drexpay (Bank transfer)" },
  { value: "manual", label: "Manual payment" },
  { value: "point", label: "Payment Point" },
];

export default function DepositsPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [transactions, setTransactions] = useState(initialTx);
  const filterRowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      const target = e.target as Node;
      if (filterRowRef.current && !filterRowRef.current.contains(target)) {
        setStatusOpen(false);
        setPaymentOpen(false);
      }
    }
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  return (
    <>
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
          <h1>My Wallet</h1>
          <p>Manage your wallet balance and transactions</p>
        </div>

        <main className="dashboard-main">
          <div className="balance-hero">
            <div className="bh-top">
              <span className="lbl">Current Balance</span>
              <div className="bh-icon">
                <Diamond size={15} />
              </div>
            </div>
            <div className="bh-amount mono">$84.60</div>
            <div className="bh-caption">Available for renting numbers</div>
            <div className="bh-actions">
              <button className="btn-topup">+ Top Up</button>
              <button className="btn-autofund">Automatic Funding</button>
            </div>
          </div>

          <div className="recap-card">
            <div className="lbl">Current Balance</div>
            <div className="amount mono">$84.60</div>
            <div className="caption">Available for renting numbers</div>
          </div>

          <div className="section-label">
            <h2>Recent Transactions</h2>
            <p>View all your deposit transactions</p>
          </div>

          <div className="search-box">
            <Search size={14} />
            Search transactions…
          </div>

          <div className="filter-row" ref={filterRowRef}>
            <div className="filter-wrap">
              <div
                className="filter-select"
                onClick={() => {
                  setPaymentOpen(false);
                  setStatusOpen((v) => !v);
                }}
              >
                {statusOptions.find((s) => s.value === statusFilter)?.label}
                <ChevronDown className="chev" size={14} />
              </div>
              {statusOpen && (
                <div className="filter-menu">
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
                onClick={() => {
                  setStatusOpen(false);
                  setPaymentOpen((v) => !v);
                }}
              >
                {paymentOptions.find((p) => p.value === paymentFilter)?.label}
                <ChevronDown className="chev" size={14} />
              </div>
              {paymentOpen && (
                <div className="filter-menu">
                  {paymentOptions.map((opt) => (
                    <div
                      key={opt.value}
                      className={`filter-menu-item ${
                        paymentFilter === opt.value ? "selected" : ""
                      }`}
                      onClick={() => {
                        setPaymentFilter(opt.value);
                        setPaymentOpen(false);
                      }}
                    >
                      <div className="left">{opt.label}</div>
                      {paymentFilter === opt.value && (
                        <Check size={14} className="check" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="tx-list">
            {transactions.map((tx) => (
              <div className="tx-card" key={tx.id}>
                <div className="tx-top">
                  <div className="tx-top-left">
                    <div className={`tx-icon ${tx.kind}`}>
                      {tx.kind === "credit" ? (
                        <ArrowDown size={15} />
                      ) : (
                        <ArrowUp size={15} />
                      )}
                    </div>
                    <span className="tx-type">
                      {tx.kind === "credit" ? "Credit" : "Debit"}
                    </span>
                    <span className={`status-pill ${tx.status}`}>
                      <span className="d" />
                      {tx.status === "ok" ? "Success" : "Pending"}
                    </span>
                  </div>
                  <div className="tx-top-right">
                    {tx.completed && (
                      <span className="comp-pill">
                        <Check size={11} /> Completed
                      </span>
                    )}
                    <button
                      className="trash-btn"
                      onClick={() =>
                        setTransactions((prev) =>
                          prev.filter((t) => t.id !== tx.id)
                        )
                      }
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
                <div className="tx-meta-row">
                  {tx.method.startsWith("Number rental") ? (
                    <Phone size={13} />
                  ) : (
                    <Landmark size={13} />
                  )}
                  {tx.method}
                </div>
                <div className="tx-grid">
                  <div>
                    <div className="lbl">Amount</div>
                    <div
                      className={`val mono ${
                        tx.amount.startsWith("+") ? "pos" : "neg"
                      }`}
                    >
                      {tx.amount}
                    </div>
                  </div>
                  <div>
                    <div className="lbl">Date</div>
                    <div className="val date">{tx.date}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}
