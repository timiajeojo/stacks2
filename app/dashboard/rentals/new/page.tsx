"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../lib/firebase";
import {
  Menu,
  ChevronDown,
  Search,
  X,
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
  { label: "Rentals", href: "/dashboard/rentals", icon: Package, active: true },
];

// SMSPool's rental country list doesn't include an ISO code, so flags are
// derived from a small name lookup. Falls back to a globe icon otherwise.
const COUNTRY_CODE_MAP: Record<string, string> = {
  "United States": "US",
  "United Kingdom": "GB",
  Russia: "RU",
  Canada: "CA",
  Germany: "DE",
  France: "FR",
  Netherlands: "NL",
  Sweden: "SE",
  Kazakhstan: "KZ",
  Indonesia: "ID",
  Romania: "RO",
  Kyrgyzstan: "KG",
  Nigeria: "NG",
  India: "IN",
  China: "CN",
  Poland: "PL",
  Ukraine: "UA",
  Spain: "ES",
  Italy: "IT",
  Brazil: "BR",
};

function flagEmoji(countryName: string): string {
  const code = COUNTRY_CODE_MAP[countryName];
  if (!code) return "🌐";
  const points = [...code].map((c) => 127397 + c.charCodeAt(0));
  return String.fromCodePoint(...points);
}

function formatNaira(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(amount);
}

const DURATIONS = [
  { days: 1, label: "1 Day" },
  { days: 3, label: "3 Days" },
  { days: 7, label: "7 Days" },
  { days: 14, label: "14 Days" },
  { days: 30, label: "30 Days" },
  { days: 90, label: "90 Days" },
  { days: 365, label: "1 Year" },
];

type RentalOption = {
  id: number;
  name: string;
  tag: string;
  pool: number;
  pricingNaira: Record<string, number>;
};

type Service = { id: number; name: string };

export default function NewRentalPage() {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [portal1Options, setPortal1Options] = useState<RentalOption[]>([]);
  const [portal2Options, setPortal2Options] = useState<RentalOption[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [activeCountryName, setActiveCountryName] = useState("");
  const [activePortal, setActivePortal] = useState<1 | 2>(1);

  const [services, setServices] = useState<Service[]>([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [serviceId, setServiceId] = useState("");
  const [serviceOpen, setServiceOpen] = useState(false);
  const [serviceSearch, setServiceSearch] = useState("");
  const serviceRef = useRef<HTMLDivElement>(null);

  const [selectedDays, setSelectedDays] = useState<number | null>(null);
  const [stockByDays, setStockByDays] = useState<Record<number, number>>({});

  const [purchasing, setPurchasing] = useState(false);
  const [purchaseError, setPurchaseError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/smspool/rental/countries?type=1").then((r) => r.json()),
      fetch("/api/smspool/rental/countries?type=2").then((r) => r.json()),
    ])
      .then(([p1, p2]) => {
        setPortal1Options(p1.options || []);
        setPortal2Options(p2.options || []);
      })
      .finally(() => setLoadingCountries(false));
  }, []);

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (serviceRef.current && !serviceRef.current.contains(e.target as Node)) {
        setServiceOpen(false);
      }
    }
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  // Unique countries across both portals, for the grid
  const allNames = Array.from(
    new Set([...portal1Options, ...portal2Options].map((o) => o.name))
  );

  function optionFor(name: string, portal: 1 | 2): RentalOption | undefined {
    const list = portal === 1 ? portal1Options : portal2Options;
    return list.find((o) => o.name === name);
  }

  const activeOption = optionFor(activeCountryName, activePortal);

  function openCountry(name: string) {
    setActiveCountryName(name);
    setActivePortal(optionFor(name, 1) ? 1 : 2);
    setServiceId("");
    setServiceSearch("");
    setSelectedDays(null);
    setStockByDays({});
    setPurchaseError("");
    setModalOpen(true);
  }

  // Load services whenever the active rental option changes
  useEffect(() => {
    if (!activeOption) {
      setServices([]);
      return;
    }
    setServicesLoading(true);
    setServiceId("");
    fetch(`/api/smspool/rental/services?rental=${activeOption.id}`)
      .then((r) => r.json())
      .then((data) => setServices(data.services || []))
      .finally(() => setServicesLoading(false));
  }, [activeOption?.id]);

  // Load stock for every available duration once a service is chosen
  useEffect(() => {
    if (!activeOption || !serviceId) return;
    const days = Object.keys(activeOption.pricingNaira).map(Number);
    days.forEach((d) => {
      fetch(`/api/smspool/rental/stock?id=${activeOption.id}&days=${d}`)
        .then((r) => r.json())
        .then((data) =>
          setStockByDays((prev) => ({ ...prev, [d]: data.count || 0 }))
        );
    });
  }, [activeOption?.id, serviceId]);

  const filteredServices = services.filter((s) =>
    s.name.toLowerCase().includes(serviceSearch.toLowerCase())
  );
  const selectedService = services.find((s) => String(s.id) === serviceId);

  const priceForSelected =
    activeOption && selectedDays
      ? activeOption.pricingNaira[String(selectedDays)]
      : null;

  const readyToPurchase =
    !!activeOption && !!serviceId && !!selectedDays && !!priceForSelected;

  async function handlePurchase() {
    if (!auth.currentUser || !activeOption || !selectedDays) {
      router.push("/auth");
      return;
    }
    setPurchasing(true);
    setPurchaseError("");
    try {
      const token = await auth.currentUser.getIdToken();
      const res = await fetch("/api/smspool/rental/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rentalId: activeOption.id,
          days: selectedDays,
          serviceId,
          countryName: activeOption.name,
        }),
      });
      const data = await res.json();
      if (data.error) {
        setPurchaseError(data.error);
      } else {
        router.push("/dashboard/rentals");
      }
    } catch {
      setPurchaseError("Something went wrong. Please try again.");
    } finally {
      setPurchasing(false);
    }
  }

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
          <h1>Rentals</h1>
          <p>
            It takes upto 24-48 hours to prepare the rentals, in order to
            check your rental status please press on Manage on the rental
            that as to be activated, but usually your rental will be
            activated instantly.
          </p>
        </div>

        <main className="dashboard-main">
          <div className="rental-notice">
            Rent your phone number here, please keep in mind financial
            services are not allowed, Keep in mind to adhere to our fair-use
            policy of a maximum of 25 SMS per day, any more SMS might not be
            shown.
          </div>

          {loadingCountries ? (
            <div style={{ color: "var(--paper-dim)", fontSize: "13.5px" }}>
              Loading countries…
            </div>
          ) : allNames.length === 0 ? (
            <div style={{ color: "var(--paper-dim)", fontSize: "13.5px" }}>
              No rental countries available right now.
            </div>
          ) : (
            <div className="country-grid">
              {allNames.map((name) => (
                <div
                  key={name}
                  className="country-card"
                  onClick={() => openCountry(name)}
                >
                  <div className="flag">{flagEmoji(name)}</div>
                  <div className="name">{name}</div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <div
        className={`rental-modal-backdrop ${modalOpen ? "open" : ""}`}
        onClick={() => setModalOpen(false)}
      />
      <div className={`rental-modal ${modalOpen ? "open" : ""}`}>
        <div className="rental-modal-head">
          <div>
            <h3>Rentals</h3>
          </div>
          <button className="rental-modal-close" onClick={() => setModalOpen(false)}>
            <X size={20} />
          </button>
        </div>
        <div className="sub">Long-term Numbers.</div>

        <div className="portal-grid">
          <div
            className={`portal-tab ${activePortal === 1 ? "active" : ""} ${
              !optionFor(activeCountryName, 1) ? "disabled" : ""
            }`}
            style={
              !optionFor(activeCountryName, 1)
                ? { opacity: 0.35, cursor: "default" }
                : undefined
            }
            onClick={() => {
              if (optionFor(activeCountryName, 1)) setActivePortal(1);
            }}
          >
            Portal 1
          </div>
          <div
            className={`portal-tab ${activePortal === 2 ? "active" : ""}`}
            style={
              !optionFor(activeCountryName, 2)
                ? { opacity: 0.35, cursor: "default" }
                : undefined
            }
            onClick={() => {
              if (optionFor(activeCountryName, 2)) setActivePortal(2);
            }}
          >
            Portal 2
          </div>
        </div>

        <div className="field select-wrap" ref={serviceRef}>
          <span className="field-label">Select service</span>
          <button
            type="button"
            className={`select-trigger ${!selectedService ? "placeholder" : ""}`}
            disabled={servicesLoading}
            onClick={() => setServiceOpen((v) => !v)}
          >
            <span className="label-text">
              {servicesLoading
                ? "Loading services…"
                : selectedService
                ? selectedService.name
                : "Select service..."}
            </span>
            <ChevronDown className="chev" size={14} />
          </button>
          {serviceOpen && (
            <div className="select-dropdown">
              <div className="select-dropdown-search">
                <Search size={14} />
                <input
                  placeholder="Search services…"
                  value={serviceSearch}
                  onChange={(e) => setServiceSearch(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="select-dropdown-list">
                {filteredServices.length === 0 ? (
                  <div className="select-dropdown-empty">No services found</div>
                ) : (
                  filteredServices.map((s) => (
                    <div
                      key={s.id}
                      className={`select-dropdown-item ${
                        serviceId === String(s.id) ? "selected" : ""
                      }`}
                      onClick={() => {
                        setServiceId(String(s.id));
                        setServiceOpen(false);
                        setServiceSearch("");
                        setSelectedDays(null);
                      }}
                    >
                      {s.name}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="field">
          <span className="field-label">Select duration</span>
          <div className="duration-grid">
            {DURATIONS.map((d) => {
              const priceNaira = activeOption?.pricingNaira[String(d.days)];
              const available = !!priceNaira && !!serviceId;
              const stock = stockByDays[d.days];
              return (
                <button
                  key={d.days}
                  className={`duration-btn ${
                    selectedDays === d.days ? "selected" : ""
                  }`}
                  disabled={!available}
                  onClick={() => setSelectedDays(d.days)}
                >
                  <div className="d-label">{d.label}</div>
                  <div className="d-price">
                    {priceNaira ? formatNaira(priceNaira) : "—"}
                  </div>
                  {available && stock !== undefined && (
                    <div className="d-stock">{stock} in stock</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {purchaseError && (
          <div
            style={{
              background: "rgba(255,92,92,0.1)",
              border: "1px solid rgba(255,92,92,0.35)",
              color: "#ff9b9b",
              fontSize: "13px",
              borderRadius: "9px",
              padding: "10px 14px",
              marginBottom: "4px",
            }}
          >
            {purchaseError}
          </div>
        )}

        <div className="rental-modal-actions">
          <button className="btn-close-outline" onClick={() => setModalOpen(false)}>
            Close
          </button>
          <button
            className={`btn-purchase ${readyToPurchase && !purchasing ? "enabled" : ""}`}
            disabled={!readyToPurchase || purchasing}
            onClick={handlePurchase}
          >
            {purchasing
              ? "Purchasing…"
              : `Purchase (${formatNaira(priceForSelected || 0)})`}
          </button>
        </div>
      </div>
    </>
  );
}
