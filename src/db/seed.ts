import { db, jobs, expenses } from "./index";
import { generateSeedData } from "@/lib/seedData";
import { JobItem, ExpenseItem } from "@/lib/types";

/**
 * Seeds a user's initial baseline data into PostgreSQL via Drizzle ORM.
 */
export async function seedUserDatabase(userId: string): Promise<{
  jobs: JobItem[];
  expenses: ExpenseItem[];
}> {
  const seed = generateSeedData(userId);

  if (db) {
    await db.insert(jobs).values(
      seed.jobs.map((j) => ({
        userId,
        customer: j.customer,
        description: j.description,
        amount: j.amount.toString(),
        completedAt: new Date(j.completedAt),
      }))
    );

    await db.insert(expenses).values(
      seed.expenses.map((e) => ({
        userId,
        category: e.category,
        description: e.description,
        amount: e.amount.toString(),
        incurredAt: new Date(e.incurredAt),
      }))
    );
  }

  return seed;
}
