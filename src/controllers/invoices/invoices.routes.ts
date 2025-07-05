import type { FastifyInstance } from "fastify";
import { createInvoice } from "./create-invoice.controller";
import { getInvoices } from "./get-invoices.controller";

export async function invoicesRoutes(app: FastifyInstance) {
	app.register(createInvoice);
	app.register(getInvoices);
}
