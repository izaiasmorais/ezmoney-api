import { ZodTypeProvider } from "fastify-type-provider-zod";
import { FastifyInstance } from "fastify";
import { errorSchema, successSchema } from "../../schemas/http";
import { prisma } from "../../services/prisma";
import { getCategoriesResponseSchema } from "../../schemas/category";
import { verifyJwt } from "../../middlewares/auth";

export async function getCategories(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().get(
		"/categories",
		{
			onRequest: [verifyJwt],
			schema: {
				tags: ["Categories"],
				operationId: "getCategories",
				summary: "Get all categories",
				response: {
					200: successSchema(getCategoriesResponseSchema).describe("Success"),
					400: errorSchema.describe("Bad Request"),
				},
			},
		},
		async (_, reply) => {
			const categories = await prisma.category.findMany({
				select: {
					id: true,
					name: true,
					color: true,
					createdAt: true,
				},
			});

			const formattedCategories = categories.map((category) => ({
				id: category.id,
				name: category.name,
				color: category.color,
				createdAt: category.createdAt.toISOString(),
			}));

			return reply.status(200).send({
				success: true,
				errors: null,
				data: {
					categories: formattedCategories,
				},
			});
		}
	);
}
