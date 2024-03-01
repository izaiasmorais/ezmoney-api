export interface User {
	id: string;
	name: string;
	email: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface CreateUserBody {
	name: string;
	email: string;
}

export interface UserRepository {
	create(user: CreateUserBody): Promise<User>;
	findByEmail(email: string): Promise<User | null>;
}
