import {
    getUsers,
    homeRoute,
    createUser,
    getUserById,
    deleteUserById,
    updateUserById,
} from "./layers/controller.js";

export function setupRoutes(server) {
    server.route('/', 'get', homeRoute);
    server.route('/users', 'get', getUsers);
    server.route('/users/:id', 'get', getUserById);
    server.route('/users', 'post', createUser);
    server.route('/users/:id', 'put', updateUserById);
    server.route('/users/:id', 'delete', deleteUserById);
}