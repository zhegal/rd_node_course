import { existsSync, readdirSync } from 'fs';
import { join } from 'path';

const ROUTE_FILE = 'route.js';

export async function getRoutePath(req, dir) {
    let currentPath = dir;
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
            currentPath = join(currentPath, fallbackDir.name);
            continue;
        }

        return false;
    }

    return join(currentPath, ROUTE_FILE);
}