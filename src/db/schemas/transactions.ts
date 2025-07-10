import { decimal, index, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { accounts } from "./accounts";
import { transactionType } from "./enums";
import { installments } from "./installments";
import { paymentMethods } from "./payment-methods";

export const transactions = pgTable(
	"transactions",
	{
		id: uuid().primaryKey().defaultRandom(),
		amount: decimal().notNull(),
		type: transactionType().notNull(),
		createdAt: timestamp().defaultNow().notNull(),
		updatedAt: timestamp().defaultNow().notNull(),
		installmentId: uuid().references(() => installments.id, {
			onDelete: "cascade",
		}),
		paymentMethodId: uuid()
			.references(() => paymentMethods.id)
			.notNull(),
		accountId: uuid()
			.references(() => accounts.id)
			.notNull(),
	},
	(table) => [
		index("transactions_installment_id_idx").on(table.installmentId),
		index("transactions_payment_method_id_idx").on(table.paymentMethodId),
		index("transactions_account_id_idx").on(table.accountId),
		index("transactions_type_idx").on(table.type),
		index("transactions_created_at_idx").on(table.createdAt),
	]
);
