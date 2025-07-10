import { eq } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { db } from "../../db/connection.ts";
import { categories } from "../../db/schemas/categories.ts";
import { installments } from "../../db/schemas/installments.ts";
import { invoices } from "../../db/schemas/invoices.ts";
import { verifyJwt } from "../../middlewares/auth.ts";
import { errorSchema, successSchema } from "../../schemas/http.ts";
import { getInvoicesResponseSchema } from "../../schemas/invoices.ts";

export async function getInvoices(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().get(
		"/invoices",
		{
			onRequest: [verifyJwt],
			schema: {
				tags: ["Invoices"],
				operationId: "getInvoices",
				summary: "Get all invoices",
				response: {
					200: successSchema(getInvoicesResponseSchema).describe("Success"),
					400: errorSchema.describe("Bad Request"),
				},
			},
		},
		async (request, reply) => {
			const userId = request.user.sub;

			const invoicesResult = await db
				.select({
					id: invoices.id,
					name: invoices.name,
					description: invoices.description,
					unitValue: invoices.unitValue,
					issueDate: invoices.issueDate,
					categoryId: invoices.categoryId,
					categoryName: categories.name,
				})
				.from(invoices)
				.innerJoin(categories, eq(invoices.categoryId, categories.id))
				.where(eq(invoices.userId, userId));

			const invoicesWithInstallments = await Promise.all(
				invoicesResult.map(async (invoice) => {
					const invoiceInstallments = await db
						.select({
							id: installments.id,
							unitValue: installments.unitValue,
							dueDate: installments.dueDate,
							status: installments.status,
						})
						.from(installments)
						.where(eq(installments.invoiceId, invoice.id));

					return {
						id: invoice.id,
						name: invoice.name,
						description: invoice.description,
						unitValue: Number(invoice.unitValue),
						totalInstallments: invoiceInstallments.length,
						issueDate: invoice.issueDate.toISOString(),
						category: invoice.categoryName,
					};
				})
			);

			return reply.status(200).send({
				success: true,
				errors: null,
				data: {
					invoices: invoicesWithInstallments,
				},
			});
		}
	);
}
