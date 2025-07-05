import { ZodTypeProvider } from "fastify-type-provider-zod";
import { FastifyInstance } from "fastify";
import { errorSchema, successSchema } from "../../schemas/http";
import { prisma } from "../../services/prisma";
import { getInvoicesResponseSchema } from "../../schemas/invoice";
import { verifyJwt } from "../../middlewares/auth";

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
		async (_, reply) => {
			const invoices = await prisma.invoice.findMany({
				include: {
					category: {
						select: {
							id: true,
							name: true,
						},
					},
					installments: {
						select: {
							id: true,
							unitValue: true,
							dueDate: true,
							status: true,
						},
					},
				},
			});

			const formattedInvoices = invoices.map((invoice) => ({
				id: invoice.id,
				name: invoice.name,
				description: invoice.description,
				unitValue: Number(invoice.unitValue),
				totalInstallments: invoice.installments.length,
				issueDate: invoice.issueDate.toISOString(),
				createdAt: invoice.createdAt.toISOString(),
				updatedAt: invoice.updatedAt.toISOString(),
				category: invoice.category.name,
			}));

			return reply.status(200).send({
				success: true,
				errors: null,
				data: {
					invoices: formattedInvoices,
				},
			});
		}
	);
}
