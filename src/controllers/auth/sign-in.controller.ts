import { compare } from "bcrypt";
import { eq } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { db } from "../../db/connection.ts";
import { users } from "../../db/schemas/users.ts";
import { env } from "../../env.ts";
import {
	signInRequestSchema,
	signInResponseSchema,
} from "../../schemas/auth.ts";
import { errorSchema, successSchema } from "../../schemas/http.ts";

export async function signIn(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		"/auth/sign-in",
		{
			schema: {
				tags: ["Auth"],
				operationId: "signIn",
				summary: "Authenticate a user",
				body: signInRequestSchema.describe("Sign in request body"),
				response: {
					200: successSchema(signInResponseSchema).describe("Success"),
					400: errorSchema.describe("Bad Request"),
					401: errorSchema.describe("Unauthorized"),
				},
			},
		},
		async (request, reply) => {
			const { email, password } = request.body;

			const user = await db
				.select({
					id: users.id,
					name: users.name,
					email: users.email,
					password: users.password,
				})
				.from(users)
				.where(eq(users.email, email))
				.limit(1);

			if (user.length === 0) {
				return reply.status(400).send({
					success: false,
					errors: ["Credenciais inválidas"],
					data: null,
				});
			}

			const isPasswordValid = await compare(password, user[0].password);
			if (!isPasswordValid) {
				return reply.status(401).send({
					success: false,
					errors: ["Credenciais inválidas"],
					data: null,
				});
			}

			const accessToken = await reply.jwtSign(
				{
					sub: user[0].id.toString(),
				},
				{
					sign: {
						expiresIn: env.EXPIRES_IN,
					},
				}
			);

			return reply.status(200).send({
				success: true,
				errors: null,
				data: {
					accessToken,
				},
			});
		}
	);
}
