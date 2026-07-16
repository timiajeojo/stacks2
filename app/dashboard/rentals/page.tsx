"use client";

import { useEffect, useRef, useState } from "react";
import {
  Menu,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  Plus,
  Check,
  Circle,
  CheckCircle2,
  Timer,
  Info,
  AlertCircle,
  XCircle,
  ArrowUp,
  ArrowDown,
  EyeOff,
  LayoutGrid,
  ArrowDownToLine,
  Package,
  MessageSquareCode,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { label: "Deposits", href: "/dashboard/deposits", icon: ArrowDownToLine },
  { label: "Verifications", href: "/dashboard/verifications", icon: CheckCircle2 },
  { label: "Rentals", href: "/dashboard/rentals", icon: Package, active: true },
];

const statusOptions = [
  { value: "created", label: "Created", icon: Circle },
  { value: "pending", label: "Pending", icon: Timer },
  { value: "active", label: "Active", icon: CheckCircle2 },
  { value: "inactive", label: "Inactive", icon: Info },
  { value: "expired", label: "Expired", icon: AlertCircle },
  { value: "cancelled", label: "Cancelled", icon: XCircle },
];

type SortableCol = "status" | "expiredAt" | "created";
const sortableColumns: { key: SortableCol; label: string }[] = [
  { key: "status", label: "Status" },
  { key: "expiredAt", label: "Expired At" },
  { key: "created", label: "Created" },
];

export default function RentalsPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [statusFilterOpen, setStatusFilterOpen] = useState(false);
  const [statusSearch, setStatusSearch] = useState("");
  const [checkedStatuses, setCheckedStatuses] = useState<string[]>([]);
  const [openColMenu, setOpenColMenu] = useState<SortableCol | null>(null);
  const [hiddenCols, setHiddenCols] = useState<SortableCol[]>([]);
  const [sortState, setSortState] = useState<
    Record<SortableCol, "asc" | "desc" | null>
  >({ status: null, expiredAt: null, created: null });

  const filterRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      const target = e.target as Node;
      if (filterRef.current && !filterRef.current.contains(target)) {
        setStatusFilterOpen(false);
      }
      if (tableRef.current && !tableRef.current.contains(target)) {
        setOpenColMenu(null);
      }
    }
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  function toggleStatus(value: string) {
    setCheckedStatuses((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }

  const filteredStatusOptions = statusOptions.filter((s) =>
    s.label.toLowerCase().includes(statusSearch.toLowerCase())
  );

  const visibleColCount =
    2 + (3 - hiddenCols.length); // Country + Number&Service + up to 3 sortable

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
          <p>View and manage your currently rented phone numbers.</p>
        </div>

        <main className="dashboard-main">
          <a
            href="/dashboard/rentals/new"
            className="btn-purchase enabled"
            style={{ textDecoration: "none" }}
          >
            + Purchase New Rental
          </a>

          <div className="filter-chip-row" ref={filterRef}>
            <button
              className="filter-chip"
              onClick={() => setStatusFilterOpen((v) => !v)}
            >
              <Plus size={14} />
              Status
              {checkedStatuses.length > 0 && ` (${checkedStatuses.length})`}
            </button>

            {statusFilterOpen && (
              <div className="status-filter-panel">
                <div className="status-filter-search">
                  <Search size={14} />
                  <input
                    placeholder="Status"
                    value={statusSearch}
                    onChange={(e) => setStatusSearch(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="status-filter-list">
                  {filteredStatusOptions.map((opt) => {
                    const checked = checkedStatuses.includes(opt.value);
                    return (
                      <div
                        key={opt.value}
                        className="status-filter-item"
                        onClick={() => toggleStatus(opt.value)}
                      >
                        <div className={`chk ${checked ? "checked" : ""}`}>
                          {checked && <Check size={11} />}
                        </div>
                        <opt.icon size={15} />
                        {opt.label}
                      </div>
                    );
                  })}
                </div>
                <div className="status-filter-footer">
                  <button onClick={() => setStatusFilterOpen(false)}>
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="search-box">
            <Search size={14} />
            Filter rentals…
          </div>

          <div className="table-wrap" ref={tableRef}>
            <div className="tbl-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Country</th>
                    <th>Number &amp; Service</th>
                    <th>Messages</th>
                    {sortableColumns.map(
                      (col) =>
                        !hiddenCols.includes(col.key) && (
                          <th key={col.key}>
                            <div
                              className="th-sortable"
                              onClick={() =>
                                setOpenColMenu(
                                  openColMenu === col.key ? null : col.key
                                )
                              }
                            >
                              {col.label}
                              <ChevronDown className="chev" size={13} />
                            </div>
                            {openColMenu === col.key && (
                              <div className="col-menu">
                                <div
                                  className="col-menu-item"
                                  onClick={() => {
                                    setSortState((s) => ({
                                      ...s,
                                      [col.key]: "asc",
                                    }));
                                    setOpenColMenu(null);
                                  }}
                                >
                                  <ArrowUp size={14} /> Asc
                                </div>
                                <div
                                  className="col-menu-item"
                                  onClick={() => {
                                    setSortState((s) => ({
                                      ...s,
                                      [col.key]: "desc",
                                    }));
                                    setOpenColMenu(null);
                                  }}
                                >
                                  <ArrowDown size={14} /> Desc
                                </div>
                                <div
                                  className="col-menu-item"
                                  onClick={() => {
                                    setHiddenCols((h) => [...h, col.key]);
                                    setOpenColMenu(null);
                                  }}
                                >
                                  <EyeOff size={14} /> Hide
                                </div>
                              </div>
                            )}
                          </th>
                        )
                    )}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={visibleColCount} style={{ textAlign: "right" }}>
                      No results.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="scrollbar">
            <i />
          </div>

          {hiddenCols.length > 0 && (
            <button
              className="filter-chip"
              style={{ marginBottom: "16px" }}
              onClick={() => setHiddenCols([])}
            >
              Show hidden columns ({hiddenCols.length})
            </button>
          )}

          <div className="pagination">
            <div className="page-size">
              10 <ChevronDown size={13} color="var(--paper-dim)" />
            </div>
            <div className="page-info">Page 1 of 0</div>
            <div className="page-nav">
              <button disabled>
                <ChevronLeft size={15} />
              </button>
              <button disabled>
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
