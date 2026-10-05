import { jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

// One row per sync code. The code is a client-generated random secret that doubles as the lookup key.
export const syncStatesTable = pgTable("sync_states", {
  id: text("id").primaryKey(),
  state: jsonb("state").$type<Record<string, unknown>>().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type SyncState = typeof syncStatesTable.$inferSelect;
