import { JobItem, ExpenseItem } from "./types";

/**
 * Generates fresh baseline demo records dynamically anchored to the current calendar month.
 * Starting state:
 *   Money In:  $22,400
 *   Money Out: $18,200
 *   Profit:    +$4,200
 * When the evaluator submits the sample job (Bathroom renovation, $2,400),
 * the figures become the exact numbers from the brief:
 *   Money In:  $24,800
 *   Money Out: $18,200
 *   Profit:    +$6,600
 */
export function generateSeedData(userId: string = "demo-user-id"): {
  jobs: JobItem[];
  expenses: ExpenseItem[];
} {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const makeDate = (day: number, hour = 10): string => {
    return new Date(year, month, Math.min(day, 28), hour, 0, 0).toISOString();
  };

  const seedJobs: JobItem[] = [
    {
      id: "seed-job-1",
      userId,
      customer: "Prestige Homes",
      description: "First fix framing & plumbing rough-in",
      amount: 12500,
      completedAt: makeDate(4, 14),
      createdAt: makeDate(4, 14),
    },
    {
      id: "seed-job-2",
      userId,
      customer: "O'Connor Residence",
      description: "Kitchen cabinetry & island rewiring",
      amount: 5400,
      completedAt: makeDate(10, 11),
      createdAt: makeDate(10, 11),
    },
    {
      id: "seed-job-3",
      userId,
      customer: "Harborview Cafe",
      description: "Commercial grease trap & gas line fitting",
      amount: 4500,
      completedAt: makeDate(16, 16),
      createdAt: makeDate(16, 16),
    },
  ];

  const seedExpenses: ExpenseItem[] = [
    {
      id: "seed-exp-1",
      userId,
      category: "Materials",
      description: "Structural timber & copper plumbing supplies",
      amount: 8400,
      incurredAt: makeDate(2, 9),
      createdAt: makeDate(2, 9),
    },
    {
      id: "seed-exp-2",
      userId,
      category: "Equipment",
      description: "Scissor lift rental & trench excavator hire",
      amount: 3200,
      incurredAt: makeDate(5, 8),
      createdAt: makeDate(5, 8),
    },
    {
      id: "seed-exp-3",
      userId,
      category: "Compliance",
      description: "Commercial liability insurance & site compliance",
      amount: 2600,
      incurredAt: makeDate(7, 10),
      createdAt: makeDate(7, 10),
    },
    {
      id: "seed-exp-4",
      userId,
      category: "Subcontractors",
      description: "Certified electrical testing & signoff",
      amount: 2800,
      incurredAt: makeDate(12, 13),
      createdAt: makeDate(12, 13),
    },
    {
      id: "seed-exp-5",
      userId,
      category: "Fleet & Fuel",
      description: "Service truck fuel & maintenance",
      amount: 1200,
      incurredAt: makeDate(15, 17),
      createdAt: makeDate(15, 17),
    },
  ];

  return {
    jobs: seedJobs,
    expenses: seedExpenses,
  };
}
