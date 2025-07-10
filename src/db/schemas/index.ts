// Barrel File

import { accounts } from "./accounts.ts";
import { budgets } from "./budgets.ts";
import { categories } from "./categories.ts";
import { accountType, installmentStatus, transactionType } from "./enums.ts";
import { installments } from "./installments.ts";
import { invoices } from "./invoices.ts";
import { paymentMethods } from "./payment-methods.ts";
import { transactions } from "./transactions.ts";
import { users } from "./users.ts";

export { users } from "./users.ts";

export const schema = {
	// Enums
	installmentStatus,
	transactionType,
	accountType,

	// Tables
	users,
	categories,
	invoices,
	installments,
	accounts,
	paymentMethods,
	transactions,
	budgets,
};
