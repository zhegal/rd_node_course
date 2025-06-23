import db from "../lib/db.js";
import { NotFoundError, ValidationError } from "../lib/errors.js";
import { getCurrentDateTime } from "../lib/getCurrentDateTime.js";
import { newIdFromArray } from "../lib/newIdFromArray.js";

export class UsersModel {
    constructor() {
        this.db = db;
    }

    getAll() {
        return db.get();
    }

    findById(id) {
        const allItems = db.get();
        const item = allItems.find(i => i.id === id);
        if (!item) {
            throw new NotFoundError('User not found');
        }
        return item;
    }

    create(name, email) {
        const allItems = db.get();
        const id = newIdFromArray(allItems);
        const currentDateTime = getCurrentDateTime();

        const check = allItems.find(i => i.email === email);
        if (check) {
            throw new ValidationError('User with this email already exists');
        }

        const user = {
            id,
            name,
            email,
            createdAt: currentDateTime,
            updatedAt: currentDateTime,
        };

        allItems.push(user);
        db.save(allItems);
        return user;
    }

    updateById(id, { name, email }) {
        const allItems = db.get();
        const item = allItems.find(i => i.id === id);
        if (!name && !email) {
            throw new ValidationError('Nothing to update');
        }
        if (!item) {
            throw new NotFoundError('User not found');
        }
        if (email && allItems.find(i => i.email === email && i.id !== id)) {
            throw new ValidationError('User with this email already exists');
        }

        if (name) item.name = name;
        if (email) item.email = email;

        item.updatedAt = getCurrentDateTime();
        db.save(allItems);
        return item;
    }

    deleteById(id) {
        const allItems = db.get();
        const index = allItems.findIndex(i => i.id === id);

        if (index === -1) {
            throw new NotFoundError('No user found with the given ID');
        }

        allItems.splice(index, 1);
        db.save(allItems);
        return true;
    }
}