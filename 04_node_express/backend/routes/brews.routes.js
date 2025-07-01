import { makeClassInvoker } from 'awilix-express';
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { BrewsController } from '../controllers/brews.controller.js';

const router = Router();
const ctl = makeClassInvoker(BrewsController);

const postLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
});

router.get('/', ctl('index'));
router.get('/:id', ctl('show'));
router.post('/', postLimiter, ctl('create'));
router.put('/:id', ctl('update'));
router.delete(':id', ctl('remove'));

export { router };