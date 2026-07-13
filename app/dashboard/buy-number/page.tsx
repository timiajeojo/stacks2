"use client";

import { useState } from "react";
import {
  Menu,
  ChevronDown,
  ChevronLeft,
  ShoppingCart,
  LayoutGrid,
  ArrowDownToLine,
  CheckCircle2,
  Package,
  MessageSquareCode,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { label: "Deposits", href: "/dashboard/deposits", icon: ArrowDownToLine },
  { label: "Verifications", href: "/dashboard/verifications", icon: CheckCircle2 },
  { label: "Rentals", href: "/dashboard/rentals", icon: Package },
];

// Placeholder — will be replaced once we wire up real Fleexa pricing per
// country/service/server (sms1/sms2/sms3).
const tiers = [
  { id: 1, price: "$4.85", stock: "128 left" },
  { id: 2, price: "$6.34", stock: "54 left" },
  { id: 3, price: "$8.90", stock: "12 left" },
];

export default function BuyNumberPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [portal, setPortal] = useState(1);

  const [country, setCountry] = useState("");
  const [service, setService] = useState("");
  const [selectedTier, setSelectedTier] = useState(1);

  const ready = country !== "" && service !== "";

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
          <a key={item.label} href={item.href} className="drawer-item">
            <div className="left">
              <item.icon size={18} />
              {item.label}
            </div>
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
          <h1>Rent a Phone Number</h1>
          <p>Choose a country and service to get started</p>
        </div>

        <main className="dashboard-main">
          <div className="portal-grid">
            <div
              className={`portal-tab ${portal === 1 ? "active" : ""}`}
              onClick={() => setPortal(1)}
            >
              Portal 1
            </div>
            <div
              className={`portal-tab ${portal === 2 ? "active" : ""}`}
              onClick={() => setPortal(2)}
            >
              Portal 2
            </div>
            <div
              className={`portal-tab ${portal === 3 ? "active" : ""}`}
              onClick={() => setPortal(3)}
            >
              Portal 3
            </div>
          </div>

          <div className="flow-box">
            <div className="flow-head">
              <a href="/dashboard" className="back-btn">
                <ChevronLeft size={18} />
              </a>
              <div>
                <div className="flow-title">Rent a Phone Number</div>
                <div className="flow-sub">Portal {portal}</div>
              </div>
            </div>

            <div className="field">
              <label>Select Country</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option value="">Select a country...</option>
                <option value="us">🇺🇸 United States</option>
                <option value="gb">🇬🇧 United Kingdom</option>
                <option value="ng">🇳🇬 Nigeria</option>
                <option value="ke">🇰🇪 Kenya</option>
                <option value="in">🇮🇳 India</option>
              </select>
            </div>

            <div className="field">
              <label>Select Service</label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
              >
                <option value="">Select a service...</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="telegram">Telegram</option>
                <option value="google">Google</option>
                <option value="instagram">Instagram</option>
                <option value="discord">Discord</option>
              </select>
            </div>

            <div className={`tier-section ${ready ? "show" : ""}`}>
              <label>Select Price Tier</label>
              <div className="tier-list">
                {tiers.map((tier) => (
                  <div
                    key={tier.id}
                    className={`tier-card ${
                      selectedTier === tier.id ? "selected" : ""
                    }`}
                    onClick={() => setSelectedTier(tier.id)}
                  >
                    <div className="tier-top">
                      <div>
                        <div className="lbl">PRICE</div>
                        <div className="price mono">{tier.price}</div>
                      </div>
                      <div className="stock">
                        {tier.stock}
                        <br />
                        <span className="lbl">STOCK</span>
                      </div>
                    </div>
                    <div className="tier-bottom">
                      <span className="name">Tier {tier.id}</span>
                      <span className="state">
                        {selectedTier === tier.id ? "Selected" : "Select"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              className={`btn-purchase ${ready ? "enabled" : ""}`}
              disabled={!ready}
            >
              <ShoppingCart size={16} />
              Purchase Number
            </button>
          </div>
        </main>
      </div>
    </>
  );
}
