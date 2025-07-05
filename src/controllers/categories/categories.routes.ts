import type { FastifyInstance } from "fastify";
import { createCategory } from "./create-category.controller";
import { getCategories } from "./get-categories.controller";

export async function categoriesRoutes(app: FastifyInstance) {
	app.register(createCategory);
	app.register(getCategories);
}
