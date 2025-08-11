import { makeClassInvoker } from 'awilix-express';
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { BrewsController } from '../controllers/brews.controller.js';
import { validate } from '../middlewares/validate.js';
import { BrewDTO } from '../dto/BrewDTO.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { registry } from '../openapi/registry.js';
import { z } from 'zod';
import { validateQuery } from '../middlewares/validateQuery.js';
import { GetAllQueryDTO } from '../dto/GetAllQueryDTO.js';

const router = Router();
const ctl = makeClassInvoker(BrewsController);

const paramsSchema = z.object({
    id: z.string().describe('Brew ID'),
});

const postLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
});

router.get('/', validateQuery(GetAllQueryDTO), asyncHandler(ctl('index')));
registry.registerPath({
    method: 'get',
    path: '/api/brews',
    tags: ['Brews'],
    request: {
        query: GetAllQueryDTO,
    },
    responses: {
        200: {
            description: 'Array of brews',
            content: {
                'application/json': {
                    schema: z.array(BrewDTO),
                },
            },
        },
        400: {
            description: 'Validation error',
            content: {
                'application/json': {
                    schema: z.object({
                        errors: z.any(),
                        where: z.string(),
                    }),
                },
            },
        },
    },
});

router.get('/:id', asyncHandler(ctl('show')));
registry.registerPath({
    method: 'get',
    path: '/api/brews/{id}',
    tags: ['Brews'],
    request: { params: paramsSchema },
    responses: {
        200: {
            description: 'Brew',
            content: {
                'application/json': { schema: BrewDTO },
            },
        },
        404: {
            description: 'Brew not found',
        },
    },
});

router.post('/', postLimiter, validate(BrewDTO), asyncHandler(ctl('create')));
registry.registerPath({
    method: 'post',
    path: '/api/brews',
    tags: ['Brews'],
    request: {
        body: { required: true, content: { 'application/json': { schema: BrewDTO } } },
    },
    responses: {
        201: {
            description: 'Created',
            content: {
                'application/json': { schema: BrewDTO },
            },
        },
        400: {
            description: 'Validation error',
        },
    },
});

router.put('/:id', validate(BrewDTO), asyncHandler(ctl('update')));
registry.registerPath({
    method: 'put',
    path: '/api/brews/{id}',
    tags: ['Brews'],
    request: {
        params: paramsSchema,
        body: { required: true, content: { 'application/json': { schema: BrewDTO } } },
    },
    responses: {
        201: {
            description: 'Created',
            content: {
                'application/json': { schema: BrewDTO },
            },
        },
        400: {
            description: 'Validation error',
        },
        404: {
            description: 'Brew not found',
        },
    },
});

router.delete('/:id', asyncHandler(ctl('remove')));
registry.registerPath({
    method: 'delete',
    path: '/api/brews/{id}',
    tags: ['Brews'],
    request: { params: paramsSchema },
    responses: {
        204: {
            description: 'Deleted',
        },
        404: {
            description: 'Brew not found',
        },
    },
});

export { router };