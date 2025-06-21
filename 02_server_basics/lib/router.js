import { dirname, join } from 'path';
import { fileURLToPath } from "url";

export async function router(req, res) {
    const currentDir = dirname(fileURLToPath(import.meta.url));
    const routesDir = join(currentDir, '..', 'routes');

    const routePath = join(routesDir, 'route.js');

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