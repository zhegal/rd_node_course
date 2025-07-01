import express from 'express';
import morgan from 'morgan';
import pino from 'pino-http';
import { config } from './config/index.js';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import { router as brewsRouter } from './routes/brews.routes.js';
import { scopePerRequest } from 'awilix-express';
import { container } from './container.js';
import { notFound } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';

export class App {
    constructor() {
        this.app = express();
        this.env = config.env;
        this.port = config.port;

        this.app.use(helmet());
        this.app.use(cors());
        this.app.use(compression());
        this.app.use(express.json());

        this.getLogger();
        this.getRoutes();
    }

    getLogger() {
        this.app.use(this.env === 'dev' ? morgan('dev') : pino());
    }

    getRoutes() {
        this.app.use(scopePerRequest(container));
        this.app.use('/api/brews', brewsRouter);
        this.app.use(notFound);
        this.app.use(errorHandler);
    }

    start() {
        this.server = this.app.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        });
        process.on('SIGINT', this.shutdown.bind(this));
        process.on('SIGTERM', this.shutdown.bind(this));
    }

    shutdown() {
        console.log('Shutting down gracefully');
        this.server.close(() => {
            console.log('Closed out remaining connections');
            process.exit(0);
        });
        setTimeout(() => process.exit(1), 10000).unref();
    }
}