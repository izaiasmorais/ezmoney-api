import { z } from "zod";

export const createInvoiceRequestSchema = z.object({
	name: z.string().min(1),
	description: z.string().optional(),
	issueDate: z.string().datetime(),
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
			category: z.string(),
		})
	),
});
