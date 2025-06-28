import z from "zod";

import "dotenv/config";

const envSchema = z.object({
	DATABASE_URL: z.string().url(),
	PORT: z.coerce.number().optional().default(3333),
	JWT_SECRET: z.string(),
	EXPIRES_IN: z.coerce.number().default(60 * 60), // 1 hour in seconds
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
});

export const env = envSchema.parse(process.env);
