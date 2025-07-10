import type { FastifyInstance } from "fastify";
import { signIn } from "./sign-in.controller.ts";
import { signUp } from "./sign-up.controller.ts";
import { getProfile } from "./get-profile.controller.ts";

export async function authRoutes(app: FastifyInstance) {
	app.register(signUp);
	app.register(signIn);
	app.register(getProfile)
}
