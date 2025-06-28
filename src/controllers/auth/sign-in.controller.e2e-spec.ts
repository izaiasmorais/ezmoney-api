import request from "supertest";
import { afterAll, beforeAll, describe, it, expect } from "vitest";
import { buildApp } from "../../app";

import { hash } from "bcrypt";
import fastify, { FastifyInstance } from "fastify";
import { prisma } from "../../services/prisma";

describe("Sign In (e2e)", () => {
	let app: FastifyInstance;

	beforeAll(async () => {
		app = fastify();
		buildApp(app);
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	it("should be able to sign in", async () => {
		await prisma.user.create({
			data: {
				name: "Acme",
				email: "acme@gmail.com",
				password: await hash("000000000", 6),
			},
		});

		const response = await request(app.server).post("/auth/sign-in").send({
			email: "acme@gmail.com",
			password: "000000000",
		});

		expect(response.statusCode).toEqual(200);

		expect(response.body).toEqual(
			expect.objectContaining({
				success: true,
				errors: null,
				data: {
					accessToken: expect.any(String),
				},
			})
		);
	});

	it("should not be able to sign in with an invalid email", async () => {
		const response = await request(app.server).post("/auth/sign-in").send({
			email: "acme@gmail.com",
			password: "000000000",
		});

		expect(response.statusCode).toEqual(400);

		expect(response.body).toEqual({
			success: false,
			errors: ["Credenciais inválidas"],
			data: null,
		});
	});
});
