// src/db/schema.ts (หรือ path ที่คุณใช้)
import { pgTable, serial, text, varchar, timestamp, integer} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  credits:integer()
});

export const travelReports = pgTable("travel_reports", {
  id: serial("id").primaryKey(),
  sessionId: varchar("session_id", { length: 255 }), // เก็บ ID ของ Vapi session
  report: text("report").notNull(), // สรุปวิธีการเดินทางที่ Gen จาก OpenRouter
  createdBy: varchar("created_by", { length: 255 }).notNull(), // อีเมลของ User
  createdOn: timestamp("created_on").defaultNow().notNull(), // เวลาที่สร้าง
});