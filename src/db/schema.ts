import { sql } from "drizzle-orm";
import {
  pgTable,
  integer,
  text,
  jsonb,
  serial,
  timestamp,
  bigint,
  index,
} from "drizzle-orm/pg-core";

const advocates = pgTable("advocates", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  city: text("city").notNull(),
  degree: text("degree").notNull(),
  specialties: jsonb("payload").default([]).notNull(),
  yearsOfExperience: integer("years_of_experience").notNull(),
  phoneNumber: bigint("phone_number", { mode: "number" }).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  advocatesSearchIndex: index('advocates_search_index').using(
    'gin',
    sql`
      (
        to_tsvector('english', ${table.firstName}) ||
        to_tsvector('english', ${table.lastName}) ||
        to_tsvector('english', ${table.city}) ||
        to_tsvector('english', ${table.degree}) ||
        to_tsvector('english', ${table.specialties}::text) ||
        to_tsvector('english', ${table.yearsOfExperience}::text) ||
        to_tsvector('english', ${table.phoneNumber}::text)
      )
    `
  )
}));

export { advocates };
