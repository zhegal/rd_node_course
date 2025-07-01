import { makeClassInvoker } from 'awilix-express';
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { BrewsController } from '../controllers/brews.controller.js';
import { validate } from '../middlewares/validate.js';
import { BrewDTO } from '../dto/BrewDTO.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';

const router = Router();
const ctl = makeClassInvoker(BrewsController);

const postLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
});

router.get('/', asyncHandler(ctl('index')));
router.get('/:id', asyncHandler(ctl('show')));
router.post('/', postLimiter, validate(BrewDTO), asyncHandler(ctl('create')));
router.put('/:id', validate(BrewDTO), asyncHandler(ctl('update')));
router.delete(':id', asyncHandler(ctl('remove')));

export { router };