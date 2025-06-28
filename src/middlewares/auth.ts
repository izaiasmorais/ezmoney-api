import { FastifyReply, FastifyRequest } from "fastify";

export async function verifyJwt(request: FastifyRequest, reply: FastifyReply) {
	try {
		await request.jwtVerify();
	} catch (err) {
		return reply.status(401).send({
			success: false,
			errors: ["Não autorizado"],
			data: null,
		});
	}
}
