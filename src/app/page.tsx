"use client";

import React, { useEffect, useState, useTransition } from "react";
import { Header } from "@/components/Header";
import { FinancialSummaryCard } from "@/components/FinancialSummaryCard";
import { RecentJobsList } from "@/components/RecentJobsList";
import { PrimaryActionButton } from "@/components/PrimaryActionButton";
import { JobDoneModal } from "@/components/JobDoneModal";
import { AuthScreen } from "@/components/AuthScreen";
import {
  getCurrentUser,
  fetchUserData,
  addJob,
  resetUserData,
  signOut,
  AppUser,
} from "@/lib/dataRepository";
import { calculateFinancialPosition } from "@/lib/calculations";
import { JobItem, ExpenseItem, CreateJobInput } from "@/lib/types";
import { CheckCircle2 } from "lucide-react";

export default function HomePage() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmationToast, setConfirmationToast] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Load user session on mount
  useEffect(() => {
    async function init() {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          const data = await fetchUserData(currentUser.id);
          setJobs(data.jobs);
          setExpenses(data.expenses);
        }
      } catch (err) {
        console.error("Failed to initialize session:", err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  // When a user logs in via AuthScreen
  const handleAuthSuccess = async (authenticatedUser: AppUser) => {
    setUser(authenticatedUser);
    setLoading(true);
    try {
      const data = await fetchUserData(authenticatedUser.id);
      setJobs(data.jobs);
      setExpenses(data.expenses);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
    setJobs([]);
    setExpenses([]);
  };

  const handleResetDemo = async () => {
    if (!user) return;
    const fresh = await resetUserData(user.id);
    setJobs(fresh.jobs);
    setExpenses(fresh.expenses);
    showToast("Baseline demo data restored");
  };

  const showToast = (message: string) => {
    setConfirmationToast(message);
    setTimeout(() => {
      setConfirmationToast((current) => (current === message ? null : current));
    }, 3500);
  };

  // Submit Job Done with instant Optimistic UI
  const handleJobSubmit = async (input: CreateJobInput) => {
    if (!user) return;

    // 1. Optimistic job creation
    const optimisticJob: JobItem = {
      id: `temp-${Date.now()}`,
      userId: user.id,
      customer: input.customer,
      description: input.description,
      amount: input.amount,
      completedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    // Instant state update
    startTransition(() => {
      setJobs((prev) => [optimisticJob, ...prev]);
    });

    // Instant toast confirmation
    showToast(`Job recorded: +$${input.amount.toLocaleString()} added to Money In!`);

    // 2. Persist to Supabase / Repository in background
    try {
      const persistedJob = await addJob(user.id, input);
      setJobs((prev) =>
        prev.map((j) => (j.id === optimisticJob.id ? persistedJob : j))
      );
    } catch (err) {
      console.error("Failed to persist job:", err);
      // Revert on error
      setJobs((prev) => prev.filter((j) => j.id !== optimisticJob.id));
      showToast("Error saving job. Please retry.");
    }
  };

  // Initial loading screen
  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 rounded-xl border-2 border-emerald-500/30 border-t-emerald-500 animate-spin" />
        <p className="text-xs uppercase tracking-widest text-zinc-400 mt-4 font-semibold">
          Loading One Login...
        </p>
      </main>
    );
  }

  // Not logged in: Show Auth Screen
  if (!user) {
    return <AuthScreen onSuccess={handleAuthSuccess} />;
  }

  // Calculate current financial position
  const financialPosition = calculateFinancialPosition(jobs, expenses);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* Top Bar */}
      <Header
        user={user}
        onResetDemo={handleResetDemo}
        onSignOut={handleSignOut}
      />

      {/* Main Single Screen Content */}
      <main className="flex-1 w-full max-w-md mx-auto px-4 py-5 pb-28 space-y-6">
        {/* Financial Summary (Hero Profit + Money In + Money Out) */}
        <FinancialSummaryCard
          position={financialPosition}
          isOptimisticPending={isPending}
        />

        {/* Compact Recent Jobs Feed */}
        <RecentJobsList jobs={jobs} />
      </main>

      {/* Dominant Primary Action Button: "JOB DONE" */}
      <PrimaryActionButton onClick={() => setIsModalOpen(true)} />

      {/* Mobile Bottom Sheet: Job Done Form */}
      <JobDoneModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleJobSubmit}
      />

      {/* Confirmation Toast */}
      {confirmationToast && (
        <div className="fixed top-16 inset-x-4 z-50 max-w-sm mx-auto flex items-center space-x-2 px-4 py-3 rounded-xl bg-zinc-900 border border-emerald-500/50 text-emerald-400 text-xs font-semibold shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span className="truncate">{confirmationToast}</span>
        </div>
      )}
    </div>
  );
}
