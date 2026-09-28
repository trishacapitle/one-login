import { createClient } from "./supabase/client";
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
  const supabase = createClient();
  if (supabase) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        return {
          id: user.id,
          email: user.email || "user@onelogin.app",
          isDemo: user.email === "demo@onelogin.app",
        };
      }
    } catch (e) {
      console.warn("Supabase auth check error:", e);
    }
  }

  // Fallback to local storage
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
  const supabase = createClient();
  const demoEmail = "demo@onelogin.app";
  const demoPassword = "DemoUser123!Secure";

  if (supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: demoEmail,
        password: demoPassword,
      });

      if (!error && data.user) {
        return {
          id: data.user.id,
          email: data.user.email || demoEmail,
          isDemo: true,
        };
      }

      // If user doesn't exist yet in Supabase, sign them up
      if (error && error.message.toLowerCase().includes("invalid login")) {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: demoEmail,
          password: demoPassword,
        });

        if (!signUpError && signUpData.user) {
          return {
            id: signUpData.user.id,
            email: signUpData.user.email || demoEmail,
            isDemo: true,
          };
        }
      }
    } catch (e) {
      console.warn("Supabase demo login error, using local session:", e);
    }
  }

  // Local fallback session
  const fallbackUser: AppUser = {
    id: "demo-sole-trader-001",
    email: demoEmail,
    isDemo: true,
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(fallbackUser));
  }

  return fallbackUser;
}

export async function loginWithEmail(email: string, password: string): Promise<{ user: AppUser | null; error: string | null }> {
  const supabase = createClient();
  if (supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { user: null, error: error.message };
    }
    if (data.user) {
      return {
        user: {
          id: data.user.id,
          email: data.user.email || email,
          isDemo: email === "demo@onelogin.app",
        },
        error: null,
      };
    }
  }

  // Fallback
  const user: AppUser = {
    id: `local-user-${email.replace(/[^a-zA-Z0-9]/g, "")}`,
    email,
    isDemo: false,
  };
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(user));
  }
  return { user, error: null };
}

export async function signUpWithEmail(email: string, password: string): Promise<{ user: AppUser | null; error: string | null }> {
  const supabase = createClient();
  if (supabase) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      return { user: null, error: error.message };
    }
    if (data.user) {
      return {
        user: {
          id: data.user.id,
          email: data.user.email || email,
          isDemo: false,
        },
        error: null,
      };
    }
  }

  const user: AppUser = {
    id: `local-user-${email.replace(/[^a-zA-Z0-9]/g, "")}`,
    email,
    isDemo: false,
  };
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(user));
  }
  return { user, error: null };
}

export async function signOut(): Promise<void> {
  const supabase = createClient();
  if (supabase) {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn("Sign out error:", e);
    }
  }

  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  }
}

export async function fetchUserData(userId: string): Promise<{ jobs: JobItem[]; expenses: ExpenseItem[] }> {
  const supabase = createClient();

  if (supabase) {
    try {
      const [jobsRes, expRes] = await Promise.all([
        supabase.from("jobs").select("*").eq("user_id", userId).order("completed_at", { ascending: false }),
        supabase.from("expenses").select("*").eq("user_id", userId).order("incurred_at", { ascending: false }),
      ]);

      if (!jobsRes.error && !expRes.error) {
        let loadedJobs: JobItem[] = (jobsRes.data || []).map((j: any) => ({
          id: j.id,
          userId: j.user_id,
          customer: j.customer,
          description: j.description,
          amount: Number(j.amount),
          completedAt: j.completed_at,
          createdAt: j.created_at,
        }));

        let loadedExpenses: ExpenseItem[] = (expRes.data || []).map((e: any) => ({
          id: e.id,
          userId: e.user_id,
          category: e.category,
          description: e.description,
          amount: Number(e.amount),
          incurredAt: e.incurred_at,
          createdAt: e.created_at,
        }));

        // If user has zero expenses or zero jobs, seed standard demo baseline to ensure dashboard is meaningful
        if (loadedJobs.length === 0 && loadedExpenses.length === 0) {
          const seed = generateSeedData(userId);
          const insertJobs = seed.jobs.map((j) => ({
            user_id: userId,
            customer: j.customer,
            description: j.description,
            amount: j.amount,
            completed_at: j.completedAt,
          }));
          const insertExp = seed.expenses.map((e) => ({
            user_id: userId,
            category: e.category,
            description: e.description,
            amount: e.amount,
            incurred_at: e.incurredAt,
          }));

          await Promise.all([
            supabase.from("jobs").insert(insertJobs),
            supabase.from("expenses").insert(insertExp),
          ]);

          return seed;
        }

        return { jobs: loadedJobs, expenses: loadedExpenses };
      }
    } catch (e) {
      console.warn("Supabase fetch failed, falling back to local storage:", e);
    }
  }

  // Local fallback
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
        // regenerate
      }
    }

    const seed = generateSeedData(userId);
    localStorage.setItem(`${STORAGE_KEYS.JOBS}_${userId}`, JSON.stringify(seed.jobs));
    localStorage.setItem(`${STORAGE_KEYS.EXPENSES}_${userId}`, JSON.stringify(seed.expenses));
    return seed;
  }

  return generateSeedData(userId);
}

export async function addJob(userId: string, input: CreateJobInput): Promise<JobItem> {
  const nowIso = new Date().toISOString();
  const supabase = createClient();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("jobs")
        .insert({
          user_id: userId,
          customer: input.customer.trim(),
          description: input.description.trim(),
          amount: input.amount,
          completed_at: nowIso,
        })
        .select()
        .single();

      if (!error && data) {
        return {
          id: data.id,
          userId: data.user_id,
          customer: data.customer,
          description: data.description,
          amount: Number(data.amount),
          completedAt: data.completed_at,
          createdAt: data.created_at,
        };
      }
    } catch (e) {
      console.warn("Supabase insert error, saving locally:", e);
    }
  }

  // Local fallback insert
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

export async function resetUserData(userId: string): Promise<{ jobs: JobItem[]; expenses: ExpenseItem[] }> {
  const supabase = createClient();
  const freshSeed = generateSeedData(userId);

  if (supabase) {
    try {
      await Promise.all([
        supabase.from("jobs").delete().eq("user_id", userId),
        supabase.from("expenses").delete().eq("user_id", userId),
      ]);

      const insertJobs = freshSeed.jobs.map((j) => ({
        user_id: userId,
        customer: j.customer,
        description: j.description,
        amount: j.amount,
        completed_at: j.completedAt,
      }));
      const insertExp = freshSeed.expenses.map((e) => ({
        user_id: userId,
        category: e.category,
        description: e.description,
        amount: e.amount,
        incurred_at: e.incurredAt,
      }));

      await Promise.all([
        supabase.from("jobs").insert(insertJobs),
        supabase.from("expenses").insert(insertExp),
      ]);
    } catch (e) {
      console.warn("Supabase reset failed:", e);
    }
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(`${STORAGE_KEYS.JOBS}_${userId}`, JSON.stringify(freshSeed.jobs));
    localStorage.setItem(`${STORAGE_KEYS.EXPENSES}_${userId}`, JSON.stringify(freshSeed.expenses));
  }

  return freshSeed;
}
