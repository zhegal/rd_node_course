export class BrewsService {
    static scope = 'singleton';
    #store = new Map();

    constructor() {
        console.log(`BrewsModel initialized`);
    }

    getAll() {
        return {
            message: 'Get All!',
        };
    }

    getOne(id) {
        return {
            id,
            message: 'Get One!',
        };
    }

    create(body) {
        return {
            ...body,
            message: 'Created!',
        };
    }

    update(id, body) {
        return {
            id, ...body,
            message: 'Updated',
        };
    }

    remove(id) {
        return {
            id,
            message: 'Removed',
        };
    }
}