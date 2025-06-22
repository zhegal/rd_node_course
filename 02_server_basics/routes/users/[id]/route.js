export async function GET (req, res, args) {
    const { id } = args;

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: `Get user with id ${id}` }));
}

export async function PATCH (req, res, args) {
    const { id } = args;

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: `Update user with id ${id}` }));
}

export async function DELETE (req, res, args) {
    const { id } = args;

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: `Delete user with id ${id}` }));
}