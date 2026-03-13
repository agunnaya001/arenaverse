import { pgTable, text, serial, integer, timestamp, numeric, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const playersTable = pgTable("players", {
  id: serial("id").primaryKey(),
  address: text("address").notNull().unique(),
  wins: integer("wins").notNull().default(0),
  losses: integer("losses").notNull().default(0),
  totalBattles: integer("total_battles").notNull().default(0),
  tokensEarned: numeric("tokens_earned", { precision: 30, scale: 0 }).notNull().default("0"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const battlesTable = pgTable("battles", {
  id: serial("id").primaryKey(),
  txHash: text("tx_hash").notNull().unique(),
  playerAddress: text("player_address").notNull(),
  opponentAddress: text("opponent_address").notNull(),
  winner: text("winner").notNull(),
  playerFighterId: integer("player_fighter_id").notNull(),
  opponentFighterId: integer("opponent_fighter_id").notNull(),
  tokensStaked: numeric("tokens_staked", { precision: 30, scale: 0 }).notNull(),
  tokensRewarded: numeric("tokens_rewarded", { precision: 30, scale: 0 }).notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertPlayerSchema = createInsertSchema(playersTable).omit({ id: true, createdAt: true, updatedAt: true });
export const insertBattleSchema = createInsertSchema(battlesTable).omit({ id: true, timestamp: true });

export type Player = typeof playersTable.$inferSelect;
export type InsertPlayer = z.infer<typeof insertPlayerSchema>;
export type Battle = typeof battlesTable.$inferSelect;
export type InsertBattle = z.infer<typeof insertBattleSchema>;
