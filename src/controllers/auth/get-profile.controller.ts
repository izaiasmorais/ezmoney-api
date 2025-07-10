import { eq } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { db } from "../../db/connection.ts";
import { users } from "../../db/schemas/users.ts";
import { verifyJwt } from "../../middlewares/auth.ts";
import { getProfileResponseSchema } from "../../schemas/auth.ts";
import { errorSchema, successSchema } from "../../schemas/http.ts";

export async function getProfile(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().get(
		"/auth/profile",
		{
			onRequest: [verifyJwt],
			schema: {
				tags: ["Auth"],
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

			const [user] = await db
				.select({
					id: users.id,
					name: users.name,
					email: users.email,
					avatarUrl: users.avatarUrl,
				})
				.from(users)
				.where(eq(users.id, userId));

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
