import { eq } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { db } from "../../db/connection.ts";
import { installments } from "../../db/schemas/installments.ts";
import { invoices } from "../../db/schemas/invoices.ts";
import { verifyJwt } from "../../middlewares/auth.ts";
import { errorSchema, successSchema } from "../../schemas/http.ts";
import {
	getInvoicesInstallmentsParamsSchema,
	getInvoicesInstallmentsResponseSchema,
} from "../../schemas/invoices.ts";

export async function getInvoicesInstallments(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().get(
		"/invoices/:invoiceId/installments",
		{
			onRequest: [verifyJwt],
			schema: {
				tags: ["Invoices"],
				operationId: "getInvoicesInstallments",
				summary: "Get invoice installments",
				params: getInvoicesInstallmentsParamsSchema,
				response: {
					200: successSchema(getInvoicesInstallmentsResponseSchema).describe(
						"Success"
					),
					400: errorSchema.describe("Bad Request"),
					404: errorSchema.describe("Not Found"),
				},
			},
		},
		async (request, reply) => {
			const userId = request.user.sub;

			const { invoiceId } = request.params;

			const [invoice] = await db
				.select({ id: invoices.id })
				.from(invoices)
				.where(eq(invoices.id, invoiceId) && eq(invoices.userId, userId));

			if (!invoice) {
				return reply.status(404).send({
					success: false,
					errors: ["Fatura não encontrada"],
					data: null,
				});
			}

			const installmentsResult = await db
				.select({
					id: installments.id,
					unitValue: installments.unitValue,
					dueDate: installments.dueDate,
					status: installments.status,
				})
				.from(installments)
				.where(eq(installments.invoiceId, invoiceId));

			const formattedInstallments = installmentsResult.map((installment) => ({
				id: installment.id,
				unitValue: Number(installment.unitValue),
				dueDate: installment.dueDate.toISOString(),
				status: installment.status,
			}));

			return reply.status(200).send({
				success: true,
				errors: null,
				data: {
					installments: formattedInstallments,
				},
			});
		}
	);
}
