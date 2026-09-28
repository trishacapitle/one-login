import { describe, it, expect } from "vitest";
import { calculateFinancialPosition, formatCurrency, formatSignedCurrency, isSameMonth } from "../src/lib/calculations";
import { generateSeedData } from "../src/lib/seedData";
import { JobItem, ExpenseItem } from "../src/lib/types";

describe("Financial Calculations Engine", () => {
  it("determines same calendar month correctly", () => {
    const d1 = new Date(2026, 8, 15);
    const d2 = new Date(2026, 8, 28);
    const d3 = new Date(2026, 7, 15);
    expect(isSameMonth(d1, d2)).toBe(true);
    expect(isSameMonth(d1, d3)).toBe(false);
  });

  it("calculates baseline seed figures accurately", () => {
    const seed = generateSeedData("test-user");
    const summary = calculateFinancialPosition(seed.jobs, seed.expenses);

    expect(summary.moneyIn).toBe(22400);
    expect(summary.moneyOut).toBe(18200);
    expect(summary.profit).toBe(4200);
    expect(summary.isInTheBlack).toBe(true);
  });

  it("reproduces exact brief financial figures after adding sample $2,400 job", () => {
    const seed = generateSeedData("test-user");
    const newJob: JobItem = {
      id: "job-new-1",
      userId: "test-user",
      customer: "Smith Plumbing",
      description: "Bathroom renovation",
      amount: 2400,
      completedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    const updatedJobs = [newJob, ...seed.jobs];
    const summary = calculateFinancialPosition(updatedJobs, seed.expenses);

    // Exact figures from the brief example:
    // $24,800 IN
    // $18,200 OUT
    // $6,600 PROFIT
    expect(summary.moneyIn).toBe(24800);
    expect(summary.moneyOut).toBe(18200);
    expect(summary.profit).toBe(6600);
    expect(summary.isInTheBlack).toBe(true);
  });

  it("identifies 'in the red' negative profit state", () => {
    const jobs: JobItem[] = [
      {
        id: "j1",
        userId: "u1",
        customer: "Customer A",
        description: "Small fix",
        amount: 1500,
        completedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
    ];

    const expenses: ExpenseItem[] = [
      {
        id: "e1",
        userId: "u1",
        category: "Rent",
        description: "Workshop lease",
        amount: 3500,
        incurredAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
    ];

    const summary = calculateFinancialPosition(jobs, expenses);
    expect(summary.moneyIn).toBe(1500);
    expect(summary.moneyOut).toBe(3500);
    expect(summary.profit).toBe(-2000);
    expect(summary.isInTheBlack).toBe(false);
  });

  it("formats currency cleanly as whole dollars", () => {
    expect(formatCurrency(24800)).toBe("$24,800");
    expect(formatCurrency(-4200)).toBe("-$4,200");
    expect(formatCurrency(0)).toBe("$0");
  });

  it("formats signed currency with plus indicator", () => {
    expect(formatSignedCurrency(2400)).toBe("+$2,400");
    expect(formatSignedCurrency(-500)).toBe("-$500");
  });
});
