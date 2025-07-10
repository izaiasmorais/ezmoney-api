import { eq } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { db } from "../../db/connection.ts";
import { categories } from "../../db/schemas/categories.ts";
import { verifyJwt } from "../../middlewares/auth.ts";
import { getCategoriesResponseSchema } from "../../schemas/categories.ts";
import { errorSchema, successSchema } from "../../schemas/http.ts";

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
		async (request, reply) => {
			const userId = request.user.sub;

			const categoriesResult = await db
				.select({
					id: categories.id,
					name: categories.name,
					color: categories.color,
					createdAt: categories.createdAt,
				})
				.from(categories)
				.where(eq(categories.userId, userId));

			const formattedCategories = categoriesResult.map((category) => ({
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
