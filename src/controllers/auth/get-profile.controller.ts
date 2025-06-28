import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { errorSchema, successSchema } from "../../schemas/http";
import { verifyJwt } from "../../middlewares/auth";
import { getProfileResponseSchema } from "../../schemas/auth";
import { prisma } from "../../services/prisma";

export async function getProfile(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().get(
		"/users/profile",
		{
			onRequest: [verifyJwt],
			schema: {
				tags: ["Users"],
				operationId: "getProfile",
				summary: "Get user profile",
				security: [{ bearerAuth: [] }],
				response: {
					200: successSchema(getProfileResponseSchema).describe("Success"),
					404: errorSchema.describe("Not Found"),
				},
			},
		},
		async (request, reply) => {
			const userId = request.user.sub;

			const user = await prisma.user.findUnique({
				where: { id: userId },
				select: {
					id: true,
					name: true,
					email: true,
					createdAt: true,
					updatedAt: true,
				},
			});

			if (!user) {
				return reply.status(404).send({
					success: false,
					errors: ["Usuário não encontrado"],
					data: null,
				});
			}

			return reply.status(200).send({
				success: true,
				errors: null,
				data: user,
			});
		}
	);
}
