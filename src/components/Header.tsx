"use client";

import React, { useState } from "react";
import { LogOut, RotateCcw, ShieldCheck } from "lucide-react";
import { AppUser } from "@/lib/dataRepository";

interface HeaderProps {
  user: AppUser | null;
  onResetDemo: () => Promise<void>;
  onSignOut: () => Promise<void>;
}

export function Header({ user, onResetDemo, onSignOut }: HeaderProps) {
  const [resetting, setResetting] = useState(false);

  const handleReset = async () => {
    if (resetting) return;
    setResetting(true);
    try {
      await onResetDemo();
    } finally {
      setResetting(false);
    }
  };

  const currentMonthName = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <header className="w-full flex items-center justify-between py-3.5 px-4 sm:px-6 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-30">
      {/* Brand logo & title */}
      <div className="flex items-center space-x-2.5">
        <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-sm font-bold tracking-tight text-zinc-100 uppercase">
              One Login
            </h1>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
              Site VIP
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 font-medium">
            {currentMonthName}
          </p>
        </div>
      </div>

      {/* User info & quick actions */}
      <div className="flex items-center space-x-1.5">
        <button
          onClick={handleReset}
          disabled={resetting}
          title="Reset to baseline demo data"
          className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/70 border border-zinc-800 transition-colors active:scale-95 disabled:opacity-50"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${resetting ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">Reset Demo</span>
        </button>

        <button
          onClick={onSignOut}
          title="Sign out"
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/70 border border-zinc-800 transition-colors active:scale-95"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
