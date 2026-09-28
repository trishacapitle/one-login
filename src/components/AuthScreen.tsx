"use client";

import React, { useState } from "react";
import { ShieldCheck, ArrowRight, Sparkles, Lock, Mail } from "lucide-react";
import { loginDemoUser, loginWithEmail, AppUser } from "@/lib/dataRepository";

interface AuthScreenProps {
  onSuccess: (user: AppUser) => void;
}

export function AuthScreen({ onSuccess }: AuthScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDemoLogin = async () => {
    setDemoLoading(true);
    setError(null);
    try {
      const user = await loginDemoUser();
      onSuccess(user);
    } catch (err: any) {
      setError(err?.message || "Failed to log in as demo user.");
    } finally {
      setDemoLoading(false);
    }
  };

  const handleCustomAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await loginWithEmail(email, password);

      if (res.error) {
        setError(res.error);
      } else if (res.user) {
        onSuccess(res.user);
      }
    } catch (err: any) {
      setError(err?.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col justify-center items-center px-4 py-8 bg-zinc-950 text-zinc-100">
      <div className="w-full max-w-sm space-y-7">
        {/* Brand Header */}
        <div className="text-center space-y-2.5">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-1 shadow-lg shadow-emerald-950/40">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight uppercase text-zinc-50">
              One Login
            </h1>
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mt-0.5">
              Site VIP • Angus Shield
            </p>
          </div>
          <p className="text-xs text-zinc-400 max-w-xs mx-auto pt-1 leading-relaxed">
            One login. One screen. One obvious action.
          </p>
        </div>

        {/* 1-Tap Demo Sign-in for Evaluator */}
        <div className="space-y-3 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 shadow-lg shadow-emerald-950/20">
          <div className="flex items-center space-x-1.5 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Evaluator Quick Start</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Review the complete 30-second workflow instantly with pre-seeded demo financials.
          </p>
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={demoLoading || loading}
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-zinc-950 font-extrabold text-sm tracking-wide uppercase transition-all shadow-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.35)] active:scale-98 disabled:opacity-60 flex items-center justify-center space-x-2"
          >
            {demoLoading ? (
              <span>Starting demo...</span>
            ) : (
              <>
                <span>1-Tap Demo Login</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </>
            )}
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center space-x-3 py-1">
          <div className="flex-1 h-px bg-zinc-800" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 shrink-0 select-none">
            Or Sign In With Email
          </span>
          <div className="flex-1 h-px bg-zinc-800" />
        </div>

        {/* Standard Email / Password Form */}
        <form onSubmit={handleCustomAuth} className="space-y-3.5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                placeholder="name@business.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || demoLoading}
            className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-800 text-zinc-100 font-bold text-xs uppercase tracking-wider transition-all border border-zinc-700 active:scale-98 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
}
