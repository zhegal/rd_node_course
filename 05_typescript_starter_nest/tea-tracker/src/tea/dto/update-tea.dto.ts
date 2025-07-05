import z from 'zod';
import { TeaSchema } from '../schemas/tea.schema';

export const UpdateTeaSchema = TeaSchema.partial();
export type UpdateTeaDto = z.infer<typeof UpdateTeaSchema>;
