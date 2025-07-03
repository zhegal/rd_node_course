export class BrewsService {
    static scope = 'singleton';
    #store = new Map();

    constructor() {
        console.log(`BrewsModel initialized`);
    }

    getAll(query = {}) {
        const min = query.ratingMin ?? 0;
        const method = query.method;

        return Array.from(this.#store.values()).filter((brew) => {
            const passRating =
                typeof brew.rating === 'number' ? brew.rating >= min : true;
            const passMethod =
                method ? brew.method === method : true;

            return passRating && passMethod;
        });
    }

    getOne(id) {
        const brew = this.#store.get(id);
        if (!brew) {
            throw Object.assign(
                new Error(`Brew with id ${id} not found`),
                { status: 404 },
            );
        }
        return brew;
    }

    create(body) {
        const id = crypto.randomUUID();
        const brew = { id, ...body };
        this.#store.set(id, brew);
        return brew;
    }

    update(id, body) {
        const brew = this.#store.get(id);
        if (!brew) {
            throw Object.assign(
                new Error(`Brew with id ${id} not found`),
                { status: 404 },
            );
        }
        const updated = { ...brew, ...body };
        this.#store.set(id, updated);
        return updated;
    }

    remove(id) {
        const existed = this.#store.delete(id);
        if (!existed) {
            throw Object.assign(
                new Error(`Brew with id ${id} not found`),
                { status: 404 },
            );
        }
        return;
    }
}