export class BrewsService {
    static scope = 'scoped';

    constructor(brewsModel) {
        console.log(`BrewsModel initialized`);
        this.brewsModel = brewsModel;
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