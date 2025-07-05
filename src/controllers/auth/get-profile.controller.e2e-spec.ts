import request from "supertest";
import { afterAll, beforeAll, describe, it, expect } from "vitest";
import { buildApp } from "../../app";
import { hash } from "bcrypt";
import fastify, { FastifyInstance } from "fastify";
import { prisma } from "../../services/prisma";

describe("Get Profile (e2e)", () => {
	let app: FastifyInstance;

	beforeAll(async () => {
		app = fastify();
		buildApp(app);
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	it("should be able to get user profile", async () => {
		const user = await prisma.user.create({
			data: {
				name: "Acme",
				email: "acme@gmail.com",
				password: await hash("00000000", 6),
			},
		});

		const accessToken = app.jwt.sign({
			sub: user.id.toString(),
		});

		const response = await request(app.server)
			.get("/auth/profile")
			.set("Authorization", `Bearer ${accessToken}`);

		expect(response.statusCode).toEqual(200);

		expect(response.body).toEqual({
			success: true,
			errors: null,
			data: {
				id: expect.any(String),
				name: "Acme",
				email: "acme@gmail.com",
				avatarUrl: null,
			},
		});
	});

	it("should not be able to get profile without token", async () => {
		const response = await request(app.server).get("/auth/profile");

		expect(response.statusCode).toEqual(401);

		expect(response.body).toEqual({
			success: false,
			errors: ["Não autorizado"],
			data: null,
		});
	});

	it("should not be able to get profile with invalid user id", async () => {
		const accessToken = app.jwt.sign({
			sub: "invalid-user-id",
		});

		const response = await request(app.server)
			.get("/auth/profile")
			.set("Authorization", `Bearer ${accessToken}`);

		expect(response.statusCode).toEqual(404);
		expect(response.body).toEqual({
			success: false,
			errors: ["Usuário não encontrado"],
			data: null,
		});
	});
});
