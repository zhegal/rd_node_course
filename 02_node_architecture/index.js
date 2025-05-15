const http = require('http');
const PORT = 3001;

class Main {
    constructor() {
        this.database = [];
        this.counter = 1;
    }

    all() {
        return this.database;
    }

    push(item) {
        const newItem = { id: this.counter++, ...item };
        this.database.push(newItem);
        return newItem;
    }

    remove(id) {
        const index = this.database.findIndex(i => i.id === id);
        if (index === -1) return false;
        this.database.splice(index, 1);
        return true;
    }

    get(id) {
        return this.database.find(i => i.id === id);
    }
}

const main = new Main();

function init(req, res) {
    const { url, method } = req;
    res.statusCode = 200;
    res.setHeader('Content-type', 'application/json');
    res.end(JSON.stringify(main.all()));
}

const server = http.createServer(init);
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});