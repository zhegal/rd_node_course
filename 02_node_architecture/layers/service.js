import { userModel } from "./model.js";

export const userService = {
    getAllUsers() {
        return userModel.findAll();
    },
    getUserById(id) {
        return userModel.findById(id);
    },
    createUser(data) {
        return userModel.create(data);
    },
    updateUser(id, data) {
        return userModel.update(Number(id), data);
    },
    removeUser(id) {
        return userModel.remove(id);
    },
};
