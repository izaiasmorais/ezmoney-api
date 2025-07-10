import { pgEnum } from "drizzle-orm/pg-core";

export const installmentStatus = pgEnum("InstallmentStatus", [
	"PENDING",
	"PAID",
	"OVERDUE",
	"DRAFT",
]);

export const transactionType = pgEnum("TransactionType", ["DEBIT", "CREDIT"]);

export const accountType = pgEnum("AccountType", [
	"CHECKING",
	"SAVINGS",
	"CREDIT_CARD",
	"INVESTMENT",
]);
