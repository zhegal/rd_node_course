export async function parseJsonBody(req) {
    return new Promise((resolve, reject) => {
        let data = '';

        req.on('data', chunk => {
            data += chunk;
        });

        req.on('end', () => {
            try {
                const json = JSON.parse(data);
                resolve(json);
            } catch {
                reject(new Error('Invalid JSON'));
            }
        });

        req.on('error', err => {
            reject(err);
        });
    });
}