import { decimal, index, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { categories } from "./categories";
import { users } from "./users";

export const budgets = pgTable(
	"budgets",
	{
		id: uuid().primaryKey().defaultRandom(),
		userId: uuid()
			.references(() => users.id, { onDelete: "cascade" })
			.notNull(),
		categoryId: uuid()
			.references(() => categories.id)
			.notNull(),
		amount: decimal().notNull(),
		createdAt: timestamp().defaultNow().notNull(),
		updatedAt: timestamp().defaultNow().notNull(),
	},
	(table) => [
		index("budgets_user_id_idx").on(table.userId),
		index("budgets_category_id_idx").on(table.categoryId),
		index("budgets_created_at_idx").on(table.createdAt),
	]
);
