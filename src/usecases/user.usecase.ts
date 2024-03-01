import {
	CreateUserBody,
	User,
	UserRepository,
} from "../interfaces/user.interface";
import { UserRepositoryPrisma } from "../repositories/user.repository";

export class UserUseCase {
	private userRepository: UserRepository;

	constructor() {
		this.userRepository = new UserRepositoryPrisma();
	}

	async create({ name, email }: CreateUserBody): Promise<User> {
		const userAlreadyExists = await this.userRepository.findByEmail(email);

		if (userAlreadyExists) {
			throw new Error("User already exists");
		}

		const result = await this.userRepository.create({ name, email });

		return result;
	}
}
