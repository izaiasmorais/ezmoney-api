import type { FastifyInstance } from "fastify";
import { createInvoice } from "./create-invoice.controller.ts";
import { getInvoicesInstallments } from "./get-invoice-installments.controller.ts";
import { getInvoices } from "./get-invoices.controller.ts";

export async function invoicesRoutes(app: FastifyInstance) {
	app.register(getInvoices);
	app.register(createInvoice);
	app.register(getInvoicesInstallments);
}
