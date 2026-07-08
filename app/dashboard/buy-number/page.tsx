"use client";

import { useState } from "react";
import {
  Menu,
  ChevronDown,
  ChevronLeft,
  ShoppingCart,
  Globe,
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

const usaPrices: Record<string, { cost: string; status: string }> = {
  whatsapp: { cost: "$1.92", status: "High" },
  telegram: { cost: "$1.50", status: "Medium" },
  google: { cost: "$2.10", status: "High" },
  instagram: { cost: "$1.75", status: "Medium" },
  discord: { cost: "$1.40", status: "Low" },
};

const tiers = [
  { id: 1, price: "$4.85", stock: "128 left" },
  { id: 2, price: "$6.34", stock: "54 left" },
  { id: 3, price: "$8.90", stock: "12 left" },
];

type Step = "select" | "usa" | "all";

export default function BuyNumberPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [step, setStep] = useState<Step>("select");

  const [usaService, setUsaService] = useState("");
  const [allCountry, setAllCountry] = useState("");
  const [allService, setAllService] = useState("");
  const [selectedTier, setSelectedTier] = useState(1);

  const usaPrice = usaPrices[usaService];
  const allReady = allCountry !== "" && allService !== "";

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
          <p>Choose your preferred service type to get started</p>
        </div>

        <main className="dashboard-main">
          {/* STEP 1: choose type */}
          <div className={`step ${step === "select" ? "active" : ""}`}>
            <div className="opt-card">
              <div className="opt-head">
                <div className="opt-icon usa">🇺🇸</div>
                <div>
                  <div className="opt-title">USA Verification</div>
                  <div className="opt-sub">
                    Get a US phone number for SMS verification
                  </div>
                </div>
              </div>
              <p className="opt-desc">
                Fast and reliable US phone numbers for verification services.
              </p>
              <button className="btn-start" onClick={() => setStep("usa")}>
                Get Started →
              </button>
            </div>

            <div className="opt-card">
              <div className="opt-head">
                <div className="opt-icon all">
                  <Globe size={20} />
                </div>
                <div>
                  <div className="opt-title">All Countries Number</div>
                  <div className="opt-sub">
                    Choose from phone numbers worldwide
                  </div>
                </div>
              </div>
              <p className="opt-desc">
                Access phone numbers from multiple countries for global
                verification needs.
              </p>
              <button className="btn-start" onClick={() => setStep("all")}>
                Get Started →
              </button>
            </div>

            <div className="pro-tip">
              <span className="em">💡</span>
              <p>
                <b>Pro Tip:</b> Both services share the same wallet balance.
                You can switch between them anytime.
              </p>
            </div>
          </div>

          {/* STEP 2: USA verification flow */}
          <div className={`step ${step === "usa" ? "active" : ""}`}>
            <div className="portal-grid">
              <div className="portal-tab active">Portal 1</div>
              <div className="portal-tab">Portal 2</div>
              <div className="portal-tab">Portal 3</div>
            </div>

            <div className="flow-box">
              <div className="flow-head">
                <button
                  className="back-btn"
                  onClick={() => setStep("select")}
                >
                  <ChevronLeft size={18} />
                </button>
                <div>
                  <div className="flow-title">USA Verification</div>
                </div>
              </div>

              <div className="field">
                <label>Select Service</label>
                <select
                  value={usaService}
                  onChange={(e) => setUsaService(e.target.value)}
                >
                  <option value="">Select a service...</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="telegram">Telegram</option>
                  <option value="google">Google</option>
                  <option value="instagram">Instagram</option>
                  <option value="discord">Discord</option>
                </select>
              </div>

              <div className={`price-box ${usaPrice ? "show" : ""}`}>
                <div>
                  <div className="lbl">COST</div>
                  <div className="cost mono">{usaPrice?.cost ?? "$0.00"}</div>
                </div>
                <div className="right">
                  <div className="lbl">PROVIDER STATUS</div>
                  <div className="status">{usaPrice?.status ?? "—"}</div>
                </div>
              </div>

              <button
                className={`btn-purchase ${usaPrice ? "enabled" : ""}`}
                disabled={!usaPrice}
              >
                <ShoppingCart size={16} />
                Purchase Number
              </button>
            </div>
          </div>

          {/* STEP 3: All countries flow */}
          <div className={`step ${step === "all" ? "active" : ""}`}>
            <div className="flow-box">
              <div className="flow-head">
                <button
                  className="back-btn"
                  onClick={() => setStep("select")}
                >
                  <ChevronLeft size={18} />
                </button>
                <div>
                  <div className="flow-title">All Countries Portal 1</div>
                  <div className="flow-sub">
                    Premium Provider with real non-VoIP numbers
                  </div>
                </div>
              </div>

              <div className="field">
                <label>Select Country</label>
                <select
                  value={allCountry}
                  onChange={(e) => setAllCountry(e.target.value)}
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
                  value={allService}
                  onChange={(e) => setAllService(e.target.value)}
                >
                  <option value="">Select a service...</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="telegram">Telegram</option>
                  <option value="google">Google</option>
                  <option value="instagram">Instagram</option>
                  <option value="discord">Discord</option>
                </select>
              </div>

              <div className={`tier-section ${allReady ? "show" : ""}`}>
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
                className={`btn-purchase ${allReady ? "enabled" : ""}`}
                disabled={!allReady}
              >
                <ShoppingCart size={16} />
                Purchase Number
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
