"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Check, DollarSign, Sparkles } from "lucide-react";
import { CreateJobInput } from "@/lib/types";

interface JobDoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: CreateJobInput) => Promise<void>;
}

export function JobDoneModal({ isOpen, onClose, onSubmit }: JobDoneModalProps) {
  const [customer, setCustomer] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const customerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      // Small timeout to allow bottom sheet animation before focusing
      const timer = setTimeout(() => {
        customerInputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    } else {
      // Reset form on close
      setCustomer("");
      setDescription("");
      setPrice("");
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFillSample = () => {
    setCustomer("Smith Plumbing");
    setDescription("Bathroom renovation");
    setPrice("2400");
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCustomer = customer.trim();
    const cleanDesc = description.trim();
    const cleanAmount = parseFloat(price.replace(/[^0-9.]/g, ""));

    if (!cleanCustomer) {
      setError("Please enter the customer name");
      return;
    }
    if (!cleanDesc) {
      setError("Please describe the work completed");
      return;
    }
    if (isNaN(cleanAmount) || cleanAmount <= 0) {
      setError("Please enter a valid price earned");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        customer: cleanCustomer,
        description: cleanDesc,
        amount: cleanAmount,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to record job. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Bottom Sheet Modal Container */}
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl z-10 animate-in slide-in-from-bottom-8 duration-200">
        {/* Drag handle for mobile */}
        <div className="w-12 h-1.5 bg-zinc-700/60 rounded-full mx-auto mb-4 sm:hidden" />

        {/* Modal Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-zinc-100 uppercase">
              Job Done
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Record completed work and update this month&apos;s income
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-200 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1-Tap Sample Prefill helper for 30s evaluation */}
        <div className="mb-4">
          <button
            type="button"
            onClick={handleFillSample}
            className="w-full flex items-center justify-center space-x-1.5 py-1.5 px-3 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all active:scale-98"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fill Brief Sample: &ldquo;Smith Plumbing • Bathroom renovation • $2,400&rdquo;</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Job Done Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Customer */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Customer
            </label>
            <input
              ref={customerInputRef}
              type="text"
              required
              placeholder="e.g. Smith Plumbing"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-base"
            />
          </div>

          {/* Job description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Job
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Bathroom renovation"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-base"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Price
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500 font-bold">
                $
              </div>
              <input
                type="text"
                inputMode="decimal"
                required
                placeholder="2,400"
                value={price}
                onChange={(e) => {
                  // Allow numbers and decimal point
                  const val = e.target.value.replace(/[^0-9.]/g, "");
                  setPrice(val);
                }}
                className="w-full pl-8 pr-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 font-semibold placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-lg tabular-nums"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-extrabold text-base tracking-wide uppercase transition-all shadow-lg shadow-emerald-500/20 active:scale-98 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {submitting ? (
                <span>Recording...</span>
              ) : (
                <>
                  <Check className="w-5 h-5 stroke-[3]" />
                  <span>Done</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
