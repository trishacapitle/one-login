"use client";

import React from "react";
import { Briefcase, Calendar } from "lucide-react";
import { JobItem } from "@/lib/types";
import { formatSignedCurrency } from "@/lib/calculations";

interface RecentJobsListProps {
  jobs: JobItem[];
}

export function RecentJobsList({ jobs }: RecentJobsListProps) {
  // Show the latest 4 jobs
  const displayJobs = jobs.slice(0, 4);

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const isToday =
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

      if (isToday) return "Today";

      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
      }).format(date);
    } catch {
      return "";
    }
  };

  return (
    <section className="w-full space-y-2.5 pt-1">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-bold tracking-wider text-zinc-400 uppercase">
          Recent Jobs
        </h3>
        <span className="text-[11px] font-medium text-zinc-400">
          {jobs.length} completed
        </span>
      </div>

      {displayJobs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-800 p-6 text-center text-zinc-500">
          <Briefcase className="w-6 h-6 mx-auto mb-2 text-zinc-600" />
          <p className="text-sm font-medium">No completed jobs yet</p>
          <p className="text-xs text-zinc-600 mt-0.5">
            Tap &ldquo;Job Done&rdquo; below to record your first job.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {displayJobs.map((job) => (
            <div
              key={job.id}
              className="flex items-center justify-between rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3.5 hover:border-zinc-700/80 transition-all"
            >
              <div className="space-y-0.5 min-w-0 pr-3">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold text-zinc-100 truncate">
                    {job.customer}
                  </span>
                  <span className="inline-flex items-center text-[10px] text-zinc-400 bg-zinc-800/80 px-1.5 py-0.5 rounded">
                    {formatDate(job.completedAt)}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 truncate">
                  {job.description}
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-sm font-bold text-emerald-400 tabular-nums">
                  {formatSignedCurrency(job.amount)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
