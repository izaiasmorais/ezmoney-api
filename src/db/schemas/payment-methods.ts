import {
	boolean,
	index,
	pgTable,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";

export const paymentMethods = pgTable(
	"payment_methods",
	{
		id: uuid().primaryKey().defaultRandom(),
		name: varchar().notNull(),
		code: varchar().unique().notNull(),
		isActive: boolean().default(true).notNull(),
		createdAt: timestamp().defaultNow().notNull(),
		updatedAt: timestamp().defaultNow().notNull(),
	},
	(table) => [
		index("payment_methods_code_idx").on(table.code),
		index("payment_methods_is_active_idx").on(table.isActive),
		index("payment_methods_created_at_idx").on(table.createdAt),
	]
);
