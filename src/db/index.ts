import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

// Drizzle database client (initialized when DATABASE_URL is present)
export const db = connectionString
  ? drizzle(postgres(connectionString, { prepare: false }), { schema })
  : null;

export * from "./schema";
