import fastifyCors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import fastify from "fastify";
import {
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { authRoutes } from "./controllers/auth/auth.routes.ts";
import { categoriesRoutes } from "./controllers/categories/categories.routes.ts";
import { invoicesRoutes } from "./controllers/invoices/invoices.routes.ts";
import { env } from "./env.ts";
import { errorHandler } from "./error-handler.ts";

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
	// @ts-ignore
	app.register(fastifyJwt, {
		secret: env.JWT_SECRET,
	});

	// Routes
	app.register(authRoutes);
	app.register(categoriesRoutes);
	app.register(invoicesRoutes);

	return app;
}

export const app = buildApp();
