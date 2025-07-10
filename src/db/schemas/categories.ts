import {
	index,
	pgTable,
	timestamp,
	unique,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const categories = pgTable(
	"categories",
	{
		id: uuid().primaryKey().defaultRandom(),
		name: varchar().notNull(),
		color: varchar().notNull(),
		createdAt: timestamp().defaultNow().notNull(),
		updatedAt: timestamp().defaultNow().notNull(),
		userId: uuid()
			.references(() => users.id, { onDelete: "cascade" })
			.notNull(),
	},
	(table) => [
		unique("categories_user_name_unique").on(table.userId, table.name),
		index("categories_created_at_idx").on(table.createdAt),
		index("categories_user_id_idx").on(table.userId),
	]
);
