import { ZodTypeProvider } from "fastify-type-provider-zod";
import { FastifyInstance } from "fastify";
import { errorSchema, successSchema } from "../../schemas/http";
import { createInvoiceRequestSchema } from "../../schemas/invoice";
import { prisma } from "../../services/prisma";
import { z } from "zod";
import { verifyJwt } from "../../middlewares/auth";

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

			const doesCategoryExists = await prisma.category.findUnique({
				where: { id: categoryId },
				select: { id: true },
			});

			if (!doesCategoryExists) {
				return reply.status(404).send({
					success: false,
					errors: ["Categoria não encontrada"],
					data: null,
				});
			}

			await prisma.$transaction(async (tx) => {
				const invoice = await tx.invoice.create({
					data: {
						name,
						description,
						unitValue,
						totalInstallments,
						categoryId,
						issueDate,
						userId,
					},
				});

				const installments = Array.from(
					{ length: totalInstallments },
					(_, index) => ({
						invoiceId: invoice.id,
						unitValue,
						dueDate: new Date(
							new Date(issueDate).setMonth(
								new Date(issueDate).getMonth() + index + 1
							)
						),
					})
				);

				await tx.installment.createMany({
					data: installments.map((installment) => ({
						...installment,
						status: "PENDING",
					})),
				});
			});

			return reply.status(201).send({
				success: true,
				errors: null,
				data: null,
			});
		}
	);
}
