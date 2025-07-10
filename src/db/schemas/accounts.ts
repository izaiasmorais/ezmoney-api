import {
	decimal,
	index,
	pgTable,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { accountType } from "./enums";
import { users } from "./users";

export const accounts = pgTable(
	"accounts",
	{
		id: uuid().primaryKey().defaultRandom(),
		userId: uuid()
			.references(() => users.id, { onDelete: "cascade" })
			.notNull(),
		name: varchar().notNull(),
		type: accountType().notNull(),
		balance: decimal().default("0").notNull(),
		createdAt: timestamp().defaultNow().notNull(),
		updatedAt: timestamp().defaultNow().notNull(),
	},
	(table) => [
		index("accounts_user_id_idx").on(table.userId),
		index("accounts_type_idx").on(table.type),
		index("accounts_created_at_idx").on(table.createdAt),
	]
);
