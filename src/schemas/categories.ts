import { z } from "zod";

export const createCategoryRequestSchema = z.object({
	name: z.string().min(1),
	color: z.string().min(1),
});

export const getCategoriesResponseSchema = z.object({
	categories: z.array(
		z.object({
			id: z.string(),
			name: z.string(),
			color: z.string(),
			createdAt: z.string().datetime(),
		})
	),
});
