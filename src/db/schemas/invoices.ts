import {
	decimal,
	index,
	pgTable,
	smallint,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { categories } from "./categories.ts";
import { users } from "./users.ts";

export const invoices = pgTable(
	"invoices",
	{
		id: uuid().primaryKey().defaultRandom(),
		name: varchar().notNull(),
		description: text(),
		unitValue: decimal().notNull(),
		totalInstallments: smallint().notNull(),
		issueDate: timestamp().notNull(),
		createdAt: timestamp().defaultNow().notNull(),
		updatedAt: timestamp().defaultNow().notNull(),
		userId: uuid()
			.references(() => users.id, { onDelete: "cascade" })
			.notNull(),
		categoryId: uuid()
			.references(() => categories.id)
			.notNull(),
	},
	(table) => [
		index("invoices_user_id_idx").on(table.userId),
		index("invoices_category_id_idx").on(table.categoryId),
		index("invoices_created_at_idx").on(table.createdAt),
	]
);
