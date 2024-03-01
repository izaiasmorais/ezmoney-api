import { FastifyInstance } from "fastify";
import { ContactUseCase } from "../usecases/contact.usercase";
import { CreateContactBody } from "../interfaces/contact.interface";
import { authMiddleware } from "../middlewares/auth.middleware";

export async function contactRoutes(fastify: FastifyInstance) {
	const contactUseCase = new ContactUseCase();

	fastify.addHook("preHandler", authMiddleware);

	fastify.post<{ Body: CreateContactBody }>("/", async (req, reply) => {
		const { name, email, phone } = req.body;

		const userEmail = req.headers["email"];

		try {
			const data = await contactUseCase.create({
				name,
				email,
				phone,
				userEmail,
			});

			return reply.send(data);
		} catch (error) {
			reply.send(error);
		}
	});

	fastify.get("/", async (req, reply) => {
		const userEmail = req.headers["email"];

		try {
			const data = await contactUseCase.getContacts(userEmail);

			return reply.send(data);
		} catch (error) {
			reply.send(error);
		}
	});
}
