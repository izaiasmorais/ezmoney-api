import { decimal, index, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { installmentStatus } from "./enums";
import { invoices } from "./invoices";

export const installments = pgTable(
	"installments",
	{
		id: uuid().primaryKey().defaultRandom(),
		unitValue: decimal().notNull(),
		dueDate: timestamp().notNull(),
		status: installmentStatus().notNull(),
		createdAt: timestamp().defaultNow().notNull(),
		updatedAt: timestamp().defaultNow().notNull(),
		invoiceId: uuid()
			.references(() => invoices.id, { onDelete: "cascade" })
			.notNull(),
	},
	(table) => [
		index("installments_invoice_id_idx").on(table.invoiceId),
		index("installments_due_date_idx").on(table.dueDate),
		index("installments_status_idx").on(table.status),
		index("installments_created_at_idx").on(table.createdAt),
	]
);
