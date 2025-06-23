import { ValidationError } from "../lib/errors.js";
import { isValidEmail } from "../lib/isValidEmail.js";
import { UsersModel } from "../models/users.model.js";

export class UsersService {
    constructor() {
        this.model = new UsersModel;
    }

    getAll() {
        const users = this.model.getAll();
        return users;
    }

    findById(id) {
        const user = this.model.findById(id);
        return user;
    }

    create(data) {
        if (!data?.name || !isValidEmail(data?.email)) {
            throw new ValidationError();
        }
        const user = this.model.create(data.name, data.email);
        return user;
    }

    updateById(id, data) {
        if (data?.email && !isValidEmail(data?.email)) {
            throw new ValidationError();
        }
        const user = this.model.updateById(id, data);
        return user;
    }

    deleteById(id) {
        const result = this.model.deleteById(id);
        return result;
    }
}