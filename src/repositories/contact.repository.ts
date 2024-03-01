import { prisma } from "../database/prisma";
import {
	Contact,
	ContactRepository,
	CreateContactData,
} from "../interfaces/contact.interface";

export class ContactRepositoryPrisma implements ContactRepository {
	async create(contact: CreateContactData): Promise<Contact> {
		const result = await prisma.contacts.create({
			data: {
				email: contact.email,
				name: contact.name,
				phone: contact.phone,
				userId: contact.userId,
			},
		});

		return result;
	}

	async findContactByEmailOrPhone(
		email: string,
		phone: string
	): Promise<Contact | null> {
		const result = await prisma.contacts.findFirst({
			where: {
				OR: [
					{
						email,
					},
					{
						phone,
					},
				],
			},
		});

		return result || null;
	}

	async findAllContacts(userId: string): Promise<Contact[]> {
		const result = await prisma.contacts.findMany({
			where: {
				userId,
			},
		});

		return result;
	}
}
