import type { FastifyInstance } from "fastify";
import { createCategory } from "./create-category.controller.ts";
import { getCategories } from "./get-categories.controller.ts";

export async function categoriesRoutes(app: FastifyInstance) {
	app.register(createCategory);
	app.register(getCategories);
}
