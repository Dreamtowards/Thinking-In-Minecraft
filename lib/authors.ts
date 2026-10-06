import { z } from 'zod';

export const authorSchema = z.union([
  z.string().trim().min(1),
  z.object({
    name: z.string().trim().min(1),
    role: z.string().trim().optional(),
  }),
]);

export type AuthorInput = z.infer<typeof authorSchema>;
export type Author = { name: string; role?: string };

export function normalizeAuthors(authors: AuthorInput[] = []): Author[] {
  return authors.map((author) => typeof author === 'string' ? { name: author } : author);
}
