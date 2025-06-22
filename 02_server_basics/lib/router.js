import { dirname, join } from 'path';
import { fileURLToPath } from "url";
import { getRoutePath } from './getRoutePath.js';

const currentDir = dirname(fileURLToPath(import.meta.url));
const routesDir = join(currentDir, '..', 'routes');

export async function router(req, res) {
    const routePath = await getRoutePath(req, routesDir);
    if (!routePath) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: 'Path Not Found' }));
    }
    
    try {
        const routeHandler = await import(routePath);
        if (routeHandler && typeof routeHandler.default === 'function') {
            await routeHandler.default(req, res);
        } else {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Invalid Route' }));
        }
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            message: 'Internal Server Error',
            error: error.code
        }));
    }
}