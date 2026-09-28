import { NextResponse } from "next/server";
import { db, jobs, expenses } from "@/db";
import { eq, desc, and, gte, lte } from "drizzle-orm";
import { seedUserDatabase } from "@/db/seed";
import { JobItem, ExpenseItem } from "@/lib/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") || "demo-sole-trader-001";

  if (!db) {
    return NextResponse.json({ dbAvailable: false });
  }

  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const userJobs = await db
      .select()
      .from(jobs)
      .where(
        and(
          eq(jobs.userId, userId),
          gte(jobs.completedAt, startOfMonth),
          lte(jobs.completedAt, endOfMonth)
        )
      )
      .orderBy(desc(jobs.completedAt));

    const userExpenses = await db
      .select()
      .from(expenses)
      .where(
        and(
          eq(expenses.userId, userId),
          gte(expenses.incurredAt, startOfMonth),
          lte(expenses.incurredAt, endOfMonth)
        )
      )
      .orderBy(desc(expenses.incurredAt));

    // If database is empty for this user this month, seed initial baseline
    if (userJobs.length === 0 && userExpenses.length === 0) {
      const seeded = await seedUserDatabase(userId);
      return NextResponse.json({
        dbAvailable: true,
        jobs: seeded.jobs,
        expenses: seeded.expenses,
      });
    }

    const formattedJobs: JobItem[] = userJobs.map((j) => ({
      id: j.id,
      userId: j.userId,
      customer: j.customer,
      description: j.description,
      amount: Number(j.amount),
      completedAt: j.completedAt.toISOString(),
      createdAt: j.createdAt.toISOString(),
    }));

    const formattedExpenses: ExpenseItem[] = userExpenses.map((e) => ({
      id: e.id,
      userId: e.userId,
      category: e.category,
      description: e.description,
      amount: Number(e.amount),
      incurredAt: e.incurredAt.toISOString(),
      createdAt: e.createdAt.toISOString(),
    }));

    return NextResponse.json({
      dbAvailable: true,
      jobs: formattedJobs,
      expenses: formattedExpenses,
    });
  } catch (error: any) {
    console.error("Drizzle query error:", error);
    return NextResponse.json(
      { dbAvailable: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, customer, description, amount } = body;

    if (!customer || !description || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!db) {
      return NextResponse.json({ dbAvailable: false });
    }

    const [inserted] = await db
      .insert(jobs)
      .values({
        userId: userId || "demo-sole-trader-001",
        customer: customer.trim(),
        description: description.trim(),
        amount: Number(amount).toString(),
        completedAt: new Date(),
      })
      .returning();

    const formatted: JobItem = {
      id: inserted.id,
      userId: inserted.userId,
      customer: inserted.customer,
      description: inserted.description,
      amount: Number(inserted.amount),
      completedAt: inserted.completedAt.toISOString(),
      createdAt: inserted.createdAt.toISOString(),
    };

    return NextResponse.json({ dbAvailable: true, job: formatted });
  } catch (error: any) {
    console.error("Drizzle insert error:", error);
    return NextResponse.json(
      { dbAvailable: false, error: error.message },
      { status: 500 }
    );
  }
}
