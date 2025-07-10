import { eq } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { db } from "../../db/connection.ts";
import { categories } from "../../db/schemas/categories.ts";
import { installments } from "../../db/schemas/installments.ts";
import { invoices } from "../../db/schemas/invoices.ts";
import { verifyJwt } from "../../middlewares/auth.ts";
import { errorSchema, successSchema } from "../../schemas/http.ts";
import { createInvoiceRequestSchema } from "../../schemas/invoices.ts";

export async function createInvoice(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		"/invoices",
		{
			onRequest: [verifyJwt],
			schema: {
				tags: ["Invoices"],
				operationId: "createInvoice",
				summary: "Create a new invoice",
				body: createInvoiceRequestSchema.describe(
					"Create invoice request body"
				),
				response: {
					201: successSchema(z.null()).describe("Created"),
					400: errorSchema.describe("Bad Request"),
					404: errorSchema.describe("Not Found"),
				},
			},
		},
		async (request, reply) => {
			const userId = request.user.sub;
			const {
				name,
				description,
				unitValue,
				totalInstallments,
				categoryId,
				issueDate,
			} = request.body;

			const [doesCategoryExists] = await db
				.select({ id: categories.id })
				.from(categories)
				.where(eq(categories.id, categoryId));

			if (!doesCategoryExists) {
				return reply.status(404).send({
					success: false,
					errors: ["Categoria não encontrada"],
					data: null,
				});
			}

			await db.transaction(async (tx) => {
				const [invoice] = await tx
					.insert(invoices)
					.values({
						name,
						description,
						unitValue: unitValue.toString(),
						totalInstallments,
						categoryId,
						issueDate: new Date(issueDate),
						userId,
					})
					.returning({ id: invoices.id });

				const installmentsData = Array.from(
					{ length: totalInstallments },
					(_, index) => ({
						invoiceId: invoice.id,
						unitValue: unitValue.toString(),
						dueDate: new Date(
							new Date(issueDate).setMonth(
								new Date(issueDate).getMonth() + index + 1
							)
						),
					})
				);

				await tx.insert(installments).values(
					installmentsData.map(
						(installment): typeof installments.$inferInsert => ({
							...installment,
							status: "PENDING",
						})
					)
				);
			});

			return reply.status(201).send({
				success: true,
				errors: null,
				data: null,
			});
		}
	);
}
