import { z } from "zod";
import { registry } from "../openapi/registry.js";

const brewMethodsEnum = ['v60', 'aeropress', 'chemex', 'espresso'];

export const BrewDTO = z.object({
    beans: z.string().min(3).max(40).describe('Beans'),
    method: z.enum(brewMethodsEnum).describe('Method'),
    rating: z.number().min(1).max(5).optional().describe('Rating'),
    notes: z.string().max(200).optional().describe('Notes'),
    brewed_at: z.string().datetime().optional().describe('Brewed At'),
});

registry.register('Brew', BrewDTO);