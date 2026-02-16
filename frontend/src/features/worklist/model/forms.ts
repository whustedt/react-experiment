import { z } from 'zod';

export const basketFilterSchema = z.object({
  status: z.enum(['OPEN', 'IN_PROGRESS', 'BLOCKED', 'DONE']).or(z.literal('')).default(''),
  colleague: z.string().optional(),
});

export const globalSearchSchema = z.object({
  q: z.string().min(2, 'Bitte mindestens 2 Zeichen eingeben.'),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'BLOCKED', 'DONE']).or(z.literal('')).default(''),
});

export type BasketFilterFormValues = z.infer<typeof basketFilterSchema>;
export type GlobalSearchFormValues = z.infer<typeof globalSearchSchema>;

export const basketFilterDefaultValues: BasketFilterFormValues = { status: '', colleague: '' };
export const globalSearchDefaultValues: GlobalSearchFormValues = { q: '', status: '' };
