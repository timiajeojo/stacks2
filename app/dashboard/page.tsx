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
    <div className="bg-ink text-paper font-sans min-h-screen">
      {/* Backdrop */}
      <div
        onClick={() => setDrawerOpen(false)}
        className={`fixed inset-0 bg-black/55 z-[90] transition-opacity duration-200 ${
          drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <nav
        className={`fixed top-0 left-0 bottom-0 w-[78%] max-w-[320px] bg-ink-2 border-r border-ink-3 z-[100] flex flex-col p-[22px_18px] transition-transform duration-300 ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-8 h-8 rounded-[9px] bg-gradient-to-br from-blue to-[#1655c9] flex items-center justify-center text-[#04101f]">
            <MessageSquareCode size={16} strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold text-[16.5px]">stacksnumber</span>
        </div>

        <div className="text-[11.5px] text-paper-dim font-mono tracking-wide mb-2.5">
          NAVIGATION
        </div>
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={`flex items-center justify-between gap-3 px-3 py-3 rounded-[10px] text-[15px] mb-1 ${
              item.active
                ? "bg-blue/10 text-blue font-medium"
                : "text-paper-dim hover:bg-ink-3 hover:text-paper"
            }`}
          >
            <div className="flex items-center gap-3">
              <item.icon size={18} className="shrink-0" />
              {item.label}
            </div>
            {item.active && <span className="w-1.5 h-1.5 rounded-full bg-blue" />}
          </a>
        ))}

        <div className="mt-auto border-t border-ink-3 pt-4">
          <div className="flex items-center justify-between px-3 py-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-ink-4 flex items-center justify-center text-[12.5px] font-semibold font-display">
                T
              </div>
              <span className="text-sm font-medium">Timi</span>
            </div>
            <ChevronDown size={16} className="text-paper-dim" />
          </div>
        </div>
      </nav>

      {/* App shell */}
      <div className="max-w-[460px] mx-auto min-h-screen relative pb-12">
        <div className="flex items-center justify-between px-5 pt-[18px] pb-1.5">
          <button
            onClick={() => setDrawerOpen(true)}
            className="w-[38px] h-[38px] rounded-[10px] bg-ink-2 border border-ink-3 flex items-center justify-center"
          >
            <Menu size={17} />
          </button>
          <div className="flex items-center gap-2 font-display font-bold text-[16px]">
            <span className="w-[22px] h-[22px] rounded-[6px] bg-gradient-to-br from-blue to-[#1655c9] flex items-center justify-center text-[#04101f]">
              <MessageSquareCode size={12} strokeWidth={2.5} />
            </span>
            stacksnumber
          </div>
          <div className="w-[38px] h-[38px] rounded-[10px] bg-ink-2 border border-ink-3 flex items-center justify-center text-[13px] font-semibold font-display">
            T
          </div>
        </div>

        <div className="px-5 pt-[18px] pb-1">
          <h1 className="font-display text-[26px] font-semibold">Dashboard</h1>
          <p className="text-[13.5px] text-paper-dim mt-1">
            Welcome back! Here&apos;s your overview.
          </p>
        </div>

        <main className="px-5 pt-4">
          {/* Wallet card */}
          <div className="relative overflow-hidden rounded-[18px] p-6 mb-[22px] bg-[linear-gradient(155deg,#16224a_0%,#1a3d8f_55%,#3D8FFF_130%)]">
            <div className="absolute w-[220px] h-[220px] rounded-full -top-[90px] -right-[70px] bg-[radial-gradient(circle,rgba(255,255,255,0.08),transparent_70%)]" />
            <div className="flex items-center justify-between mb-[18px] relative z-[1]">
              <span className="text-[13.5px] text-[#c7d6ff]">Wallet Balance</span>
              <div className="w-[34px] h-[34px] rounded-full bg-white/[0.14] flex items-center justify-center">
                <Wallet size={15} />
              </div>
            </div>
            <div className="font-display font-mono text-[38px] font-bold mb-1.5 relative z-[1]">
              $84.60
            </div>
            <div className="text-[12.5px] text-[#c7d6ff] mb-5 relative z-[1]">
              <b className="text-teal font-semibold">+12%</b> from last month
            </div>
            <button className="w-full bg-paper text-ink border-none py-3.5 rounded-[11px] text-[14.5px] font-semibold relative z-[1]">
              Top Up
            </button>
          </div>

          {/* Quick actions */}
          <div className="mb-3.5">
            <h2 className="font-display text-[18px] font-semibold">Quick Actions</h2>
            <p className="text-[13px] text-paper-dim mt-0.5">
              Get started with these common tasks
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-[22px]">
            <a
              href="/dashboard/buy-number"
              className="rounded-[14px] p-5 px-4 flex flex-col gap-3.5 border border-ink-3 bg-blue/[0.08]"
            >
              <div className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center bg-blue/[0.18] text-blue">
                <ShoppingCart size={17} />
              </div>
              <span className="text-sm font-semibold text-blue">Buy Number</span>
            </a>
            <a
              href="/dashboard/verifications"
              className="rounded-[14px] p-5 px-4 flex flex-col gap-3.5 border border-ink-3 bg-[#5aa9e6]/[0.07]"
            >
              <div className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center bg-[#5aa9e6]/[0.16] text-[#5aa9e6]">
                <Phone size={16} />
              </div>
              <span className="text-sm font-semibold text-[#5aa9e6]">My Numbers</span>
            </a>
            <a
              href="/dashboard/deposits"
              className="rounded-[14px] p-5 px-4 flex flex-col gap-3.5 border border-ink-3 bg-teal/[0.08]"
            >
              <div className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center bg-teal/[0.16] text-teal">
                <Wallet size={16} />
              </div>
              <span className="text-sm font-semibold text-teal">Wallet</span>
            </a>
            <a
              href="/dashboard/profile"
              className="rounded-[14px] p-5 px-4 flex flex-col gap-3.5 border border-ink-3 bg-[#8c7ae6]/[0.08]"
            >
              <div className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center bg-[#8c7ae6]/[0.16] text-[#8c7ae6]">
                <User size={16} />
              </div>
              <span className="text-sm font-semibold text-[#8c7ae6]">Profile</span>
            </a>
          </div>

          {/* Community card */}
          {!communityDismissed && (
            <div className="relative border border-[#2a4a8a] bg-blue/[0.05] rounded-[14px] p-[18px] mb-4">
              <button
                onClick={() => setCommunityDismissed(true)}
                className="absolute top-3.5 right-3.5 text-paper-dim"
              >
                <X size={14} />
              </button>
              <p className="text-[13.5px] leading-relaxed mb-3.5 pr-5">
                Join our Telegram channel for customer support and quick updates
                on available numbers.
              </p>
              <button className="inline-flex items-center gap-2 border border-blue text-blue bg-transparent px-4 py-2.5 rounded-[9px] text-[13.5px] font-medium">
                <Send size={14} />
                Join Telegram Channel →
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
