export function respond(res, statusCode, data = null) {
    if (statusCode === 204) {
        res.writeHead(204);
        return res.end();
    }
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(data ? JSON.stringify(data) : undefined);
}