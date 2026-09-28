import { JobItem, ExpenseItem, FinancialPosition } from "./types";

/**
 * Checks whether two ISO date strings or Date objects belong to the same calendar month and year.
 */
export function isSameMonth(dateA: Date | string, dateB: Date | string): boolean {
  const d1 = typeof dateA === "string" ? new Date(dateA) : dateA;
  const d2 = typeof dateB === "string" ? new Date(dateB) : dateB;
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth();
}

/**
 * Calculates current month's Money In, Money Out, and Profit.
 */
export function calculateFinancialPosition(
  jobs: JobItem[],
  expenses: ExpenseItem[],
  now = new Date()
): FinancialPosition {
  const currentMonthJobs = jobs.filter((job) => isSameMonth(job.completedAt, now));
  const currentMonthExpenses = expenses.filter((exp) => isSameMonth(exp.incurredAt, now));

  const moneyIn = currentMonthJobs.reduce((sum, job) => sum + (Number(job.amount) || 0), 0);
  const moneyOut = currentMonthExpenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);
  const profit = moneyIn - moneyOut;

  return {
    moneyIn: Math.round(moneyIn),
    moneyOut: Math.round(moneyOut),
    profit: Math.round(profit),
    isInTheBlack: profit >= 0,
  };
}

/**
 * Formats a number as a whole-dollar currency string with commas.
 * Examples: 24800 -> "$24,800", -4500 -> "-$4,500"
 */
export function formatCurrency(amount: number): string {
  const abs = Math.abs(Math.round(amount));
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(abs);

  return amount < 0 ? `-${formatted}` : formatted;
}

/**
 * Formats an amount with an explicit plus/minus sign.
 * Example: 2400 -> "+$2,400", -150 -> "-$150"
 */
export function formatSignedCurrency(amount: number): string {
  if (amount > 0) {
    return `+${formatCurrency(amount)}`;
  }
  return formatCurrency(amount);
}
