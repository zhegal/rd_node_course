import { z } from 'zod';

export const TeaSchema = z.object({
  name: z.string().min(3).max(40),
  origin: z.string().min(2).max(30),
  rating: z.number().min(1).max(10).optional(),
  brewTemp: z.number().min(60).max(100).optional(),
  notes: z.string().max(150).optional(),
});

export type Tea = z.infer<typeof TeaSchema> & { id: string };
