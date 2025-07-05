import { FastifyReply, FastifyRequest } from "fastify";
import { env } from "../env";

export async function verifyJwt(request: FastifyRequest, reply: FastifyReply) {
	try {
		await request.jwtVerify();
	} catch (err) {
		if (env.NODE_ENV !== "test") {
			console.error("JWT verification failed:", err);
		}

		return reply.status(401).send({
			success: false,
			errors: ["Não autorizado"],
			data: null,
		});
	}
}
