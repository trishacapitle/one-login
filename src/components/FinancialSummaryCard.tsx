"use client";

import React, { useEffect, useState } from "react";
import { ArrowDownRight, ArrowUpRight, CheckCircle2, AlertTriangle } from "lucide-react";
import { FinancialPosition } from "@/lib/types";
import { formatCurrency } from "@/lib/calculations";

interface FinancialSummaryCardProps {
  position: FinancialPosition;
  isOptimisticPending?: boolean;
}

export function FinancialSummaryCard({
  position,
  isOptimisticPending = false,
}: FinancialSummaryCardProps) {
  // Animated value transitions
  const [displayIn, setDisplayIn] = useState(position.moneyIn);
  const [displayOut, setDisplayOut] = useState(position.moneyOut);
  const [displayProfit, setDisplayProfit] = useState(position.profit);

  useEffect(() => {
    setDisplayIn(position.moneyIn);
    setDisplayOut(position.moneyOut);
    setDisplayProfit(position.profit);
  }, [position.moneyIn, position.moneyOut, position.profit]);

  const isInTheBlack = position.isInTheBlack;

  return (
    <section className="w-full space-y-3.5">
      {/* Section Header */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xs font-bold tracking-wider text-zinc-400 uppercase">
          This Month
        </h2>
        {isOptimisticPending && (
          <span className="flex items-center space-x-1 text-[11px] font-medium text-emerald-400 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Updating...</span>
          </span>
        )}
      </div>

      {/* Hero Card: PROFIT State */}
      <div
        className={`relative overflow-hidden rounded-2xl border p-5 sm:p-6 transition-all duration-300 shadow-xl ${
          isInTheBlack
            ? "border-emerald-500/40 bg-gradient-to-b from-emerald-950/30 via-zinc-900/80 to-zinc-950/90 shadow-emerald-950/20"
            : "border-rose-500/40 bg-gradient-to-b from-rose-950/30 via-zinc-900/80 to-zinc-950/90 shadow-rose-950/20"
        }`}
      >
        {/* Ambient Top Glow */}
        <div
          className={`absolute -top-12 -right-12 w-44 h-44 rounded-full blur-3xl pointer-events-none opacity-25 ${
            isInTheBlack ? "bg-emerald-500" : "bg-rose-500"
          }`}
        />

        <div className="relative z-10 flex flex-col items-center text-center space-y-2">
          {/* Status Badge */}
          <div
            className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border uppercase ${
              isInTheBlack
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                : "bg-rose-500/10 text-rose-400 border-rose-500/30 animate-pulse"
            }`}
          >
            {isInTheBlack ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>In The Black</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>In The Red</span>
              </>
            )}
          </div>

          {/* Large Hero Profit Amount */}
          <div className="py-1">
            <div
              className={`text-4xl sm:text-5xl font-extrabold tracking-tight tabular-nums transition-colors duration-200 ${
                isInTheBlack ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {formatCurrency(displayProfit)}
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mt-1">
              Net Profit
            </p>
          </div>
        </div>
      </div>

      {/* Flanking Metrics: $ IN and $ OUT */}
      <div className="grid grid-cols-2 gap-3">
        {/* Money In */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-4 transition-all hover:border-zinc-700/80">
          <div className="flex items-center justify-between text-zinc-400 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              $ In
            </span>
            <div className="w-5 h-5 rounded-md bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100 tabular-nums">
            {formatCurrency(displayIn)}
          </div>
          <p className="text-[11px] text-zinc-500 mt-0.5">
            Income received
          </p>
        </div>

        {/* Money Out */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-4 transition-all hover:border-zinc-700/80">
          <div className="flex items-center justify-between text-zinc-400 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              $ Out
            </span>
            <div className="w-5 h-5 rounded-md bg-zinc-800 text-zinc-400 flex items-center justify-center">
              <ArrowDownRight className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100 tabular-nums">
            {formatCurrency(displayOut)}
          </div>
          <p className="text-[11px] text-zinc-500 mt-0.5">
            Expenses recorded
          </p>
        </div>
      </div>
    </section>
  );
}
