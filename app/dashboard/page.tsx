"use client";

import { useState } from "react";
import {
  Menu,
  X,
  ChevronDown,
  ShoppingCart,
  Phone,
  Wallet,
  User,
  LayoutGrid,
  ArrowDownToLine,
  CheckCircle2,
  Package,
  Send,
  MessageSquareCode,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutGrid, active: true },
  { label: "Deposits", href: "/dashboard/deposits", icon: ArrowDownToLine },
  { label: "Verifications", href: "/dashboard/verifications", icon: CheckCircle2 },
  { label: "Rentals", href: "/dashboard/rentals", icon: Package },
];

export default function DashboardPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [communityDismissed, setCommunityDismissed] = useState(false);

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
          <h1>Dashboard</h1>
          <p>Welcome back! Here&apos;s your overview.</p>
        </div>

        <main className="dashboard-main">
          <div className="wallet-card">
            <div className="wallet-top">
              <span className="lbl">Wallet Balance</span>
              <div className="wallet-icon">
                <Wallet size={15} />
              </div>
            </div>
            <div className="wallet-amount mono">$84.60</div>
            <div className="wallet-change">
              <b>+12%</b> from last month
            </div>
            <button className="topup-btn">Top Up</button>
          </div>

          <div className="section-label">
            <h2>Quick Actions</h2>
            <p>Get started with these common tasks</p>
          </div>
          <div className="qa-grid">
            <a href="/dashboard/buy-number" className="qa-card qa-buy">
              <div className="qa-icon">
                <ShoppingCart size={17} />
              </div>
              <span className="label">Buy Number</span>
            </a>
            <a href="/dashboard/verifications" className="qa-card qa-numbers">
              <div className="qa-icon">
                <Phone size={16} />
              </div>
              <span className="label">My Numbers</span>
            </a>
            <a href="/dashboard/deposits" className="qa-card qa-wallet">
              <div className="qa-icon">
                <Wallet size={16} />
              </div>
              <span className="label">Wallet</span>
            </a>
            <a href="/dashboard/profile" className="qa-card qa-profile">
              <div className="qa-icon">
                <User size={16} />
              </div>
              <span className="label">Profile</span>
            </a>
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
                Join our Telegram channel for customer support and quick
                updates on available numbers.
              </p>
              <button className="telegram-btn">
                <Send size={14} />
                Join Telegram Channel →
              </button>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
