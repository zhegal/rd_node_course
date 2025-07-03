import { z } from 'zod';

export const GetAllQueryDTO = z.object({
    method: z.enum(['v60', 'aeropress', 'chemex', 'espresso']).optional(),
    ratingMin: z.coerce.number().min(0).max(5).optional(),
});