import { prisma } from "../database/prisma";
import {
	User,
	UserRepository,
	CreateUserBody,
} from "../interfaces/user.interface";

export class UserRepositoryPrisma implements UserRepository {
	async create(user: CreateUserBody): Promise<User> {
		const result = await prisma.user.create({
			data: {
				name: user.name,
				email: user.email,
			},
		});

		return result;
	}

	async findByEmail(email: string): Promise<User | null> {
		const result = await prisma.user.findFirst({
			where: {
				email,
			},
		});

		return result || null;
	}
}
