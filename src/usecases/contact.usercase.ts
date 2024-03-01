import {
	ContactRepository,
	CreateContactBody,
} from "../interfaces/contact.interface";
import { UserRepository } from "../interfaces/user.interface";
import { ContactRepositoryPrisma } from "../repositories/contact.repository";
import { UserRepositoryPrisma } from "../repositories/user.repository";

export class ContactUseCase {
	private contactRepository: ContactRepository;
	private userRepository: UserRepository;

	constructor() {
		this.contactRepository = new ContactRepositoryPrisma();
		this.userRepository = new UserRepositoryPrisma();
	}

	async create({ email, name, phone, userEmail }: CreateContactBody) {
		const user = await this.userRepository.findByEmail(userEmail);

		if (!user) {
			throw new Error("User not found");
		}

		const contactAlreadyExists =
			await this.contactRepository.findContactByEmailOrPhone(email, phone);

		if (contactAlreadyExists) {
			throw new Error("Contact already exists");
		}

		const contact = await this.contactRepository.create({
			email,
			name,
			phone,
			userId: user.id,
		});

		return contact;
	}

	async getContacts(userEmail: string) {
		const user = await this.userRepository.findByEmail(userEmail);

		if (!user) {
			throw new Error("User not found");
		}

		const contacts = await this.contactRepository.findAllContacts(user.id);

		return contacts;
	}
}
