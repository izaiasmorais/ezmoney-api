import { ZodTypeProvider } from "fastify-type-provider-zod";
import { FastifyInstance } from "fastify";
import { errorSchema, successSchema } from "../../schemas/http";
import { createCategoryRequestSchema } from "../../schemas/category";
import { prisma } from "../../services/prisma";
import { z } from "zod";
import { verifyJwt } from "../../middlewares/auth";

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

			const doesCategoryExists = await prisma.category.findUnique({
				where: {
					userId_name: {
						userId,
						name,
					},
				},
				select: { id: true },
			});

			if (doesCategoryExists) {
				return reply.status(409).send({
					success: false,
					errors: ["A categoria já existe"],
					data: null,
				});
			}

			await prisma.category.create({
				data: {
					name,
					userId,
					color,
				},
			});

			return reply.status(201).send({
				success: true,
				errors: null,
				data: null,
			});
		}
	);
}
