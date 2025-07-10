import type { FastifyInstance } from "fastify";
import type { FastifySchemaValidationError } from "fastify/types/schema.js";
import { ZodError } from "zod";

type FastifyErrorHandler = FastifyInstance["errorHandler"];

export const errorHandler: FastifyErrorHandler = async (error, _, reply) => {
	console.log(error);

	if (error instanceof ZodError) {
		return reply.status(400).send({
			success: false,
			errors: error.validation ? error.validation[0].message : [],
			data: null,
		});
	}

	if (error instanceof Error && "statusCode" in error) {
		const statusCode = error.statusCode || 500;
		const errors = error.validation?.map(
			(e: FastifySchemaValidationError) => e.message
		);

		return reply.status(statusCode).send({
			success: false,
			errors,
			data: null,
		});
	}

	reply.status(500).send({
		success: false,
		errors: ["Internal Server Error"],
		data: null,
	});
};
