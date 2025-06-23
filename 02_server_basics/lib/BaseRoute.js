import { parseJsonBody } from "./parseJsonBody.js";

export class BaseRoute {
    constructor(req, res, args) {
        this.req = req;
        this.res = res;
        this.args = args;
    }

    async getBody() {
        return await parseJsonBody(this.req);
    }

    async handle(method) {
        try {
            const handler = this[method];
            if (typeof handler !== 'function') {
                this.res.statusCode = 405;
                this.res.setHeader('Content-Type', 'application/json');
                return this.res.end(JSON.stringify({ error: `Method ${method} not allowed` }));
            }

            const body = await handler.call(this);

            if (body !== undefined) {
                const json = typeof body === 'object' ? JSON.stringify(body) : JSON.stringify({ result: body });
                this.res.statusCode ||= 200;
                this.res.setHeader('Content-Type', 'application/json');
                this.res.end(json);
            } else {
                this.res.statusCode ||= 204;
                this.res.end();
            }
        } catch (error) {
            if (process.env.NODE_ENV !== 'production') {
                console.error('Request error:', error);
            }

            const status = error.statusCode || 500;
            const message = error.message || 'Internal Server Error';

            this.res.statusCode = status;
            this.res.setHeader('Content-Type', 'application/json');
            this.res.end(JSON.stringify({ error: message }));
        }
    }
}