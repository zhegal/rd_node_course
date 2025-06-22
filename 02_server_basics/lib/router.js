import { dirname, join } from 'path';
import { fileURLToPath } from "url";
import { getRoutePath } from './getRoutePath.js';

const currentDir = dirname(fileURLToPath(import.meta.url));
const routesDir = join(currentDir, '..', 'routes');

export async function router(req, res) {
    const { method } = req;
    const route = await getRoutePath(req, routesDir);
    if (!route) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: 'Path Not Found' }));
    }
    
    try {
        const routeHandler = await import(route.path);
        if (routeHandler && routeHandler[method]) {
            return await routeHandler[method](req, res, route.args);
        } else {
            res.writeHead(405, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Invalid Method' }));
        }
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            message: 'Internal Server Error',
            error: error.code
        }));
    }
}