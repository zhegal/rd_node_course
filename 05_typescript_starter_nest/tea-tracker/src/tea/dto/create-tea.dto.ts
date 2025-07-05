import z from 'zod';
import { TeaSchema } from '../schemas/tea.schema';

export type CreateTeaDto = z.infer<typeof TeaSchema>;
