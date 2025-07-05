import { z } from "zod";

export const signUpRequestBodySchema = z.object({
	name: z.string().min(3, "O Nome deve ter no mínimo 3 caracteres"),
	email: z.string().email("Email inválido"),
	password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
});

export const signInRequestBodySchema = signUpRequestBodySchema.pick({
	email: true,
	password: true,
});

export const signInResponseSchema = z.object({
	accessToken: z.string(),
});

export const getProfileResponseSchema = z.object({
	id: z.string().uuid(),
	name: z.string(),
	email: z.string().email(),
	avatarUrl: z.string().nullable(),
});
