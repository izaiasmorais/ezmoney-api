import { index, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const users = pgTable(
	"users",
	{
		id: uuid().primaryKey().defaultRandom(),
		name: varchar().notNull(),
		email: varchar().unique().notNull(),
		avatarUrl: varchar(),
		password: varchar().notNull(),
		createdAt: timestamp().defaultNow().notNull(),
		updatedAt: timestamp().defaultNow().notNull(),
	},
	(table) => [
		index("users_created_at_idx").on(table.createdAt),
		index("users_email_idx").on(table.email),
	]
);
