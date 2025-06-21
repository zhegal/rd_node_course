import { dirname, join } from 'path';
import { fileURLToPath } from "url";

export async function router(req, res) {
    const currentDir = dirname(fileURLToPath(import.meta.url));
    const routesDir = join(currentDir, '..', 'routes');

    const routePath = join(routesDir, 'route.js');
    const routeHandler = await import(routePath);

    try {
        routeHandler.default(req, res);
    } catch (e) {
        console.log('error', e);
    }
}