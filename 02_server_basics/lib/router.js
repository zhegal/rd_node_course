import { dirname, join } from 'path';
import { fileURLToPath } from "url";
import { getRoutePath } from './getRoutePath.js';
import { respond } from './respond.js';

const currentDir = dirname(fileURLToPath(import.meta.url));
const routesDir = join(currentDir, '..', 'routes');

export async function router(req, res) {
    const { method } = req;
    const route = await getRoutePath(req, routesDir);
    if (!route) {
        const body = { message: 'Path Not Found' };
        return respond(res, 404, body);
    }
    
    try {
        const handleRoute = await import(route.path);
        const target = new handleRoute.Route(req, res, route.args);
        return await target.handle(method);
    } catch (error) {
        console.error('Error:', error);
        const body = {
            message: 'Internal Server Error',
            error: error.code
        };
        return respond(res, 500, body);
    }
}