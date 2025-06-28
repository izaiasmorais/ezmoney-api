import { ZodTypeProvider } from "fastify-type-provider-zod";
import { FastifyInstance } from "fastify";
import { errorSchema, successSchema } from "../../schemas/http";
import { signUpRequestBodySchema } from "../../schemas/auth";
import { prisma } from "../../services/prisma";
import { hash } from "bcrypt";
import { z } from "zod";

export async function signUp(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		"/auth/sign-up",
		{
			schema: {
				tags: ["Auth"],
				operationId: "signUp",
				summary: "Register a new user",
				body: signUpRequestBodySchema.describe("Sign up request body"),
				response: {
					201: successSchema(z.null()).describe("Created"),
					400: errorSchema.describe("Bad Request"),
					409: errorSchema.describe("Conflict"),
				},
			},
		},
		async (request, reply) => {
			const { name, email, password } = request.body;

			const doesUserAlreadyExists = await prisma.user.findUnique({
				where: {
					email,
				},
				select: { id: true },
			});

			if (doesUserAlreadyExists) {
				return reply.status(409).send({
					success: false,
					errors: ["E-mail já cadastrado"],
					data: null,
				});
			}

			await prisma.user.create({
				data: {
					name: name,
					email: email.toLowerCase(),
					password: await hash(password, 6),
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
