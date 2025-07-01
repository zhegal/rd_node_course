import express from 'express';

export class App {
    constructor() {
        this.app = express();
        this.app.use(express.json());
        this.port = process.env.PORT || 3000;
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