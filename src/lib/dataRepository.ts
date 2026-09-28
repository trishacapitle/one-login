import { JobItem, ExpenseItem, CreateJobInput } from "./types";
import { generateSeedData } from "./seedData";

const STORAGE_KEYS = {
  SESSION: "one_login_session",
  JOBS: "one_login_jobs",
  EXPENSES: "one_login_expenses",
};

export interface AppUser {
  id: string;
  email: string;
  isDemo: boolean;
}

export async function getCurrentUser(): Promise<AppUser | null> {
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSION);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        return null;
      }
    }
  }
  return null;
}

export async function loginDemoUser(): Promise<AppUser> {
  const fallbackUser: AppUser = {
    id: "demo-sole-trader-001",
    email: "demo@onelogin.app",
    isDemo: true,
  };

  try {
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "demo" }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.user) {
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(data.user));
        }
        return data.user;
      }
    }
  } catch (e) {
    console.warn("Auth API error, using local demo user:", e);
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(fallbackUser));
  }
  return fallbackUser;
}

export async function loginWithEmail(
  email: string,
  password: string
): Promise<{ user: AppUser | null; error: string | null }> {
  try {
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "login", email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { user: null, error: data.error || "Login failed" };
    }
    if (typeof window !== "undefined" && data.user) {
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(data.user));
    }
    return { user: data.user, error: null };
  } catch (err: any) {
    return { user: null, error: err.message || "Network error" };
  }
}

export async function signUpWithEmail(
  email: string,
  password: string
): Promise<{ user: AppUser | null; error: string | null }> {
  try {
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "signup", email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { user: null, error: data.error || "Sign up failed" };
    }
    if (typeof window !== "undefined" && data.user) {
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(data.user));
    }
    return { user: data.user, error: null };
  } catch (err: any) {
    return { user: null, error: err.message || "Network error" };
  }
}

export async function signOut(): Promise<void> {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  }
}

export async function fetchUserData(
  userId: string
): Promise<{ jobs: JobItem[]; expenses: ExpenseItem[] }> {
  // Try fetching from backend API (Drizzle ORM)
  try {
    const res = await fetch(`/api/jobs?userId=${encodeURIComponent(userId)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.dbAvailable && Array.isArray(data.jobs)) {
        return { jobs: data.jobs, expenses: data.expenses || [] };
      }
    }
  } catch (e) {
    console.warn("Backend API unavailable, using local persistence:", e);
  }

  // Local fallback storage
  if (typeof window !== "undefined") {
    const rawJobs = localStorage.getItem(`${STORAGE_KEYS.JOBS}_${userId}`);
    const rawExp = localStorage.getItem(`${STORAGE_KEYS.EXPENSES}_${userId}`);

    if (rawJobs && rawExp) {
      try {
        return {
          jobs: JSON.parse(rawJobs),
          expenses: JSON.parse(rawExp),
        };
      } catch {
        // regenerate below
      }
    }

    const seed = generateSeedData(userId);
    localStorage.setItem(`${STORAGE_KEYS.JOBS}_${userId}`, JSON.stringify(seed.jobs));
    localStorage.setItem(`${STORAGE_KEYS.EXPENSES}_${userId}`, JSON.stringify(seed.expenses));
    return seed;
  }

  return generateSeedData(userId);
}

export async function addJob(
  userId: string,
  input: CreateJobInput
): Promise<JobItem> {
  const nowIso = new Date().toISOString();

  // Try saving via Drizzle ORM backend API
  try {
    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        customer: input.customer,
        description: input.description,
        amount: input.amount,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.dbAvailable && data.job) {
        // Also sync local storage
        if (typeof window !== "undefined") {
          const key = `${STORAGE_KEYS.JOBS}_${userId}`;
          const raw = localStorage.getItem(key);
          const existing: JobItem[] = raw ? JSON.parse(raw) : [];
          localStorage.setItem(key, JSON.stringify([data.job, ...existing]));
        }
        return data.job;
      }
    }
  } catch (e) {
    console.warn("API insert failed, saving to local storage:", e);
  }

  // Local storage save
  const newJob: JobItem = {
    id: `local-job-${Date.now()}`,
    userId,
    customer: input.customer.trim(),
    description: input.description.trim(),
    amount: input.amount,
    completedAt: nowIso,
    createdAt: nowIso,
  };

  if (typeof window !== "undefined") {
    const key = `${STORAGE_KEYS.JOBS}_${userId}`;
    const raw = localStorage.getItem(key);
    const existing: JobItem[] = raw ? JSON.parse(raw) : [];
    const updated = [newJob, ...existing];
    localStorage.setItem(key, JSON.stringify(updated));
  }

  return newJob;
}

export async function resetUserData(
  userId: string
): Promise<{ jobs: JobItem[]; expenses: ExpenseItem[] }> {
  try {
    const res = await fetch("/api/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.jobs && data.expenses) {
        if (typeof window !== "undefined") {
          localStorage.setItem(`${STORAGE_KEYS.JOBS}_${userId}`, JSON.stringify(data.jobs));
          localStorage.setItem(`${STORAGE_KEYS.EXPENSES}_${userId}`, JSON.stringify(data.expenses));
        }
        return { jobs: data.jobs, expenses: data.expenses };
      }
    }
  } catch (e) {
    console.warn("API reset failed:", e);
  }

  const freshSeed = generateSeedData(userId);
  if (typeof window !== "undefined") {
    localStorage.setItem(`${STORAGE_KEYS.JOBS}_${userId}`, JSON.stringify(freshSeed.jobs));
    localStorage.setItem(`${STORAGE_KEYS.EXPENSES}_${userId}`, JSON.stringify(freshSeed.expenses));
  }
  return freshSeed;
}
