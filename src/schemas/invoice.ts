import { z } from "zod";

export const createInvoiceRequestBodySchema = z.object({
	name: z.string().min(1),
	description: z.string().optional(),
	issueDate: z.string().date(),
	unitValue: z.number().positive(),
	totalInstallments: z.number().int().min(1).max(12),
	categoryId: z.string().uuid(),
});

export const getInvoicesResponseSchema = z.object({
	invoices: z.array(
		z.object({
			id: z.string(),
			name: z.string(),
			description: z.string().nullable(),
			unitValue: z.number(),
			totalInstallments: z.number(),
			issueDate: z.string().datetime(),
			createdAt: z.string().datetime(),
			updatedAt: z.string().datetime(),
			category: z.string(),
		})
	),
});
