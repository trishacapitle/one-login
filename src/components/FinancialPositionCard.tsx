"use client";

import React, { useEffect, useState, useRef } from "react";
import { ArrowDownRight, ArrowUpRight, CheckCircle2, AlertTriangle } from "lucide-react";
import { FinancialPosition } from "@/lib/types";
import { formatCurrency } from "@/lib/calculations";

interface FinancialPositionCardProps {
  position: FinancialPosition;
  isOptimisticPending?: boolean;
}

// Hook to animate numbers smoothly on change (odometer effect)
function useAnimatedNumber(target: number, durationMs = 400): number {
  const [current, setCurrent] = useState(target);
  const startRef = useRef(target);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion || target === current) {
      setCurrent(target);
      return;
    }

    startRef.current = current;
    startTimeRef.current = null;
    let animId: number;

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const step = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / durationMs, 1);
      const eased = easeOutCubic(progress);
      const nextVal = Math.round(startRef.current + (target - startRef.current) * eased);
      setCurrent(nextVal);

      if (progress < 1) {
        animId = requestAnimationFrame(step);
      } else {
        setCurrent(target);
      }
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [target]);

  return current;
}

export function FinancialPositionCard({
  position,
  isOptimisticPending = false,
}: FinancialPositionCardProps) {
  // Smooth animated odometer numbers
  const animatedProfit = useAnimatedNumber(position.profit);
  const animatedMoneyIn = useAnimatedNumber(position.moneyIn);
  const animatedMoneyOut = useAnimatedNumber(position.moneyOut);

  const isInTheBlack = position.isInTheBlack;

  return (
    <section className="w-full space-y-3">
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
        className={`relative overflow-hidden rounded-2xl border p-5 sm:p-6 transition-all duration-300 shadow-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] ${
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
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>In The Black</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>In The Red</span>
              </>
            )}
          </div>

          {/* Large Hero Profit Amount with dynamic text sizing */}
          <div className="py-1">
            <div
              className={`text-3xl min-[360px]:text-4xl sm:text-5xl font-extrabold tracking-tight tabular-nums transition-colors duration-200 ${
                isInTheBlack ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {formatCurrency(animatedProfit)}
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mt-1">
              Profit
            </p>
          </div>
        </div>
      </div>

      {/* Supporting Metrics: Money In and Money Out */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        {/* Money In */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-3.5 sm:p-4 transition-all hover:border-zinc-700/80 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
          <div className="flex items-center justify-between text-zinc-400 mb-1.5">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider truncate mr-1">
              Money In
            </span>
            <div className="w-5 h-5 rounded-md bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl min-[360px]:text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100 tabular-nums truncate">
            {formatCurrency(animatedMoneyIn)}
          </div>
          <p className="text-[10px] sm:text-[11px] text-zinc-500 mt-0.5 truncate">
            Income received
          </p>
        </div>

        {/* Money Out */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-3.5 sm:p-4 transition-all hover:border-zinc-700/80 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
          <div className="flex items-center justify-between text-zinc-400 mb-1.5">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider truncate mr-1">
              Money Out
            </span>
            <div className="w-5 h-5 rounded-md bg-zinc-800 text-zinc-400 flex items-center justify-center shrink-0">
              <ArrowDownRight className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl min-[360px]:text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100 tabular-nums truncate">
            {formatCurrency(animatedMoneyOut)}
          </div>
          <p className="text-[10px] sm:text-[11px] text-zinc-500 mt-0.5 truncate">
            Expenses recorded
          </p>
        </div>
      </div>
    </section>
  );
}
