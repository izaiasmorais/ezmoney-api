import { hash } from "bcrypt";
import { eq } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { db } from "../../db/connection.ts";
import { users } from "../../db/schemas/index.ts";
import { signUpRequestSchema } from "../../schemas/auth.ts";
import { errorSchema, successSchema } from "../../schemas/http.ts";

export async function signUp(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		"/auth/sign-up",
		{
			schema: {
				tags: ["Auth"],
				operationId: "signUp",
				summary: "Register a new user",
				body: signUpRequestSchema.describe("Sign up request body"),
				response: {
					201: successSchema(z.any()).describe("Created"),
					400: errorSchema.describe("Bad Request"),
					409: errorSchema.describe("Conflict"),
				},
			},
		},
		async (request, reply) => {
			const { name, email, password } = request.body;

			const existingUser = await db
				.select({ id: users.id })
				.from(users)
				.where(eq(users.email, email))
				.limit(1);

			if (existingUser.length > 0) {
				return reply.status(409).send({
					success: false,
					errors: ["E-mail já cadastrado."],
					data: null,
				});
			}

			await db.insert(users).values({
				name,
				email: email.toLowerCase(),
				password: await hash(password, 6),
			});

			return reply.status(201).send({
				success: true,
				errors: null,
				data: null,
			});
		}
	);
}
