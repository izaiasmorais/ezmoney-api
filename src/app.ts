import {
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
	ZodTypeProvider,
} from "fastify-type-provider-zod";
import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import fastifyJwt from "@fastify/jwt";

import { errorHandler } from "./error-handler";
import { authRoutes } from "./controllers/auth/auth.routes";
import { env } from "./env";
import { invoicesRoutes } from "./controllers/invoices/invoices.routes";
import { categoriesRoutes } from "./controllers/categories/categories.routes";

const version = "1.0.0 - Release 1";

export function buildApp(app = fastify().withTypeProvider<ZodTypeProvider>()) {
	app.setValidatorCompiler(validatorCompiler);
	app.setSerializerCompiler(serializerCompiler);
	app.setErrorHandler(errorHandler);
	app.register(fastifyCors);
	app.register(fastifySwagger, {
		openapi: {
			info: {
				title: `EZMoney API - ${env.NODE_ENV} - [Version: ${version}]`,
				description: "API para o EZMoney.",
				version: version,
			},
			components: {
				securitySchemes: {
					bearerAuth: {
						type: "http",
						scheme: "bearer",
						bearerFormat: "JWT",
					},
				},
			},
		},
		transform: jsonSchemaTransform,
	});
	app.register(fastifySwaggerUI, {
		routePrefix: "/",
	});
	app.register(fastifyJwt, {
		secret: env.JWT_SECRET,
	});

	// Routes
	app.register(authRoutes);
	app.register(invoicesRoutes);
	app.register(categoriesRoutes);

	return app;
}

export const app = buildApp();
