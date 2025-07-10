import { and, eq } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { db } from "../../db/connection.ts";
import { categories } from "../../db/schemas/categories.ts";
import { verifyJwt } from "../../middlewares/auth.ts";
import { createCategoryRequestSchema } from "../../schemas/categories.ts";
import { errorSchema, successSchema } from "../../schemas/http.ts";

export async function createCategory(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		"/categories",
		{
			onRequest: [verifyJwt],
			schema: {
				tags: ["Categories"],
				operationId: "createCategory",
				summary: "Create a new category",
				body: createCategoryRequestSchema.describe(
					"Create category request body"
				),
				response: {
					201: successSchema(z.null()).describe("Created"),
					400: errorSchema.describe("Bad Request"),
					409: errorSchema.describe("Conflict"),
				},
			},
		},
		async (request, reply) => {
			const userId = request.user.sub;
			const { name, color } = request.body;

			const [doesCategoryExists] = await db
				.select({ id: categories.id })
				.from(categories)
				.where(and(eq(categories.userId, userId), eq(categories.name, name)));

			if (doesCategoryExists) {
				return reply.status(409).send({
					success: false,
					errors: ["A categoria já existe"],
					data: null,
				});
			}

			await db.insert(categories).values({
				name,
				userId,
				color,
			});

			return reply.status(201).send({
				success: true,
				errors: null,
				data: null,
			});
		}
	);
}
