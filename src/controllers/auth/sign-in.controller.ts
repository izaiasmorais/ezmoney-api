import { ZodTypeProvider } from "fastify-type-provider-zod";
import { FastifyInstance } from "fastify";
import { errorSchema, successSchema } from "../../schemas/http";
import {
	signInRequestBodySchema,
	signInResponseSchema,
} from "../../schemas/auth";
import { prisma } from "../../services/prisma";
import { compare } from "bcrypt";
import { env } from "../../env";

export async function signIn(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		"/auth/sign-in",
		{
			schema: {
				tags: ["Auth"],
				operationId: "signIn",
				summary: "Authenticate a user",
				body: signInRequestBodySchema.describe("Sign in request body"),
				response: {
					200: successSchema(signInResponseSchema).describe("Success"),
					400: errorSchema.describe("Bad Request"),
					401: errorSchema.describe("Unauthorized"),
				},
			},
		},
		async (request, reply) => {
			const { email, password } = request.body;

			const user = await prisma.user.findUnique({
				where: { email },
				select: {
					id: true,
					name: true,
					email: true,
					password: true,
				},
			});

			if (!user) {
				return reply.status(400).send({
					success: false,
					errors: ["Credenciais inválidas"],
					data: null,
				});
			}

			const isPasswordValid = await compare(password, user.password);

			if (!isPasswordValid) {
				return reply.status(401).send({
					success: false,
					errors: ["Credenciais inválidas"],
					data: null,
				});
			}

			const accessToken = await reply.jwtSign(
				{
					sub: user.id.toString(),
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
