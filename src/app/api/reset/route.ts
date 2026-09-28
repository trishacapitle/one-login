import { NextResponse } from "next/server";
import { db, jobs, expenses } from "@/db";
import { eq } from "drizzle-orm";
import { seedUserDatabase } from "@/db/seed";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const userId = body.userId || "demo-sole-trader-001";

    if (db) {
      // Clear existing records for user
      await db.delete(jobs).where(eq(jobs.userId, userId));
      await db.delete(expenses).where(eq(expenses.userId, userId));
    }

    // Re-seed baseline records
    const fresh = await seedUserDatabase(userId);

    return NextResponse.json({
      success: true,
      jobs: fresh.jobs,
      expenses: fresh.expenses,
    });
  } catch (error: any) {
    console.error("Drizzle reset error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
