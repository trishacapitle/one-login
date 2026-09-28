import { NextResponse } from "next/server";
import { db, jobs, expenses } from "@/db";
import { eq } from "drizzle-orm";
import { generateSeedData } from "@/lib/seedData";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const userId = body.userId || "demo-sole-trader-001";

    const freshSeed = generateSeedData(userId);

    if (db) {
      // Clear existing records for user
      await db.delete(jobs).where(eq(jobs.userId, userId));
      await db.delete(expenses).where(eq(expenses.userId, userId));

      // Re-insert baseline
      await db.insert(jobs).values(
        freshSeed.jobs.map((j) => ({
          userId,
          customer: j.customer,
          description: j.description,
          amount: j.amount.toString(),
          completedAt: new Date(j.completedAt),
        }))
      );

      await db.insert(expenses).values(
        freshSeed.expenses.map((e) => ({
          userId,
          category: e.category,
          description: e.description,
          amount: e.amount.toString(),
          incurredAt: new Date(e.incurredAt),
        }))
      );
    }

    return NextResponse.json({
      success: true,
      jobs: freshSeed.jobs,
      expenses: freshSeed.expenses,
    });
  } catch (error: any) {
    console.error("Drizzle reset error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
