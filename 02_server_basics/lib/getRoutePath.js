import { existsSync, readdirSync } from 'fs';
import { join } from 'path';

const ROUTE_FILE = 'route.js';

export async function getRoutePath(req, dir) {
    let currentPath = dir;
    const args = {};
    const urlPath = req.url.split('?')[0];
    const segments = urlPath.split('/').filter(Boolean);

    for (const segment of segments) {
        const checkPath = join(currentPath, segment);
        if (existsSync(checkPath)) {
            currentPath = checkPath;
            continue;
        }
        const fallbackDir = readdirSync(currentPath, { withFileTypes: true })
            .find(dirent =>
                dirent.isDirectory() &&
                /^\[.+\]$/.test(dirent.name)
            );

        if (fallbackDir) {
            const match = fallbackDir.name.match(/^\[(.+)\]$/);
            if (match) {
                const paramName = match[1];
                args[paramName] = segment;
                currentPath = join(currentPath, fallbackDir.name);
                continue;
            }
        }

        return false;
    }

    return {
        path: join(currentPath, ROUTE_FILE),
        args,
    };
}