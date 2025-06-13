import http from 'http';
import { respond } from './helpers/respond.js';

export class Server {
    constructor(port = 3001) {
        this.port = port;
        this.routes = [];
        this.server = http.createServer((req, res) => this.handleRequest(req, res));
    }

    route(path, method, handler) {
        this.routes.push({ path, method: method.toUpperCase(), handler });
    }

    matchRoute(req) {
        const { url, method } = req;
        const reqParts = url.split('/').filter(Boolean);
        const route = this.routes.find((route) => {
            if (route.method !== method.toUpperCase()) return false;
            const routeParts = route.path.split('/').filter(Boolean);
            if (routeParts.length !== reqParts.length) return false;
            return routeParts.every((part, i) => part.startsWith(':') || part === reqParts[i]);
        });
        if (!route) return null;
        const routeParts = route.path.split('/').filter(Boolean);
        const params = {};

        routeParts.forEach((part, i) => {
            if (part.startsWith(':')) {
                params[part.slice(1)] = reqParts[i];
            }
        });

        return { handler: route.handler, params };
    }

    handleRequest(req, res) {
        try {
            const match = this.matchRoute(req);
            if (!match) return respond(res, 404, { error: 'Not Found' });
            req.params = match.params;
            match.handler(req, res);
        } catch (e) {
            respond(res, 500, { error: 'Internal Server Error', message: e.message });
        }
    }

    run() {
        this.server.listen(this.port, () => {
            console.log(`Server is running on ${this.port} port`);
        });
    }
}