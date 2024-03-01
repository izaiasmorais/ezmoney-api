export interface Contact {
	id: string;
	name: string;
	email: string;
	phone: string;
	userId: string;
}

export interface CreateContactBody {
	name: string;
	email: string;
	phone: string;
	userEmail: string;
}

export interface CreateContactData {
	name: string;
	email: string;
	phone: string;
	userId: string;
}

export interface ContactRepository {
	create(contact: CreateContactData): Promise<Contact>;
	findContactByEmailOrPhone(
		email: string,
		phone: string
	): Promise<Contact | null>;
	findAllContacts(userId: string): Promise<Contact[]>;
}
