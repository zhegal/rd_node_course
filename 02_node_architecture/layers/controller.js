import { parseRequestBody } from "../helpers/parseRequestBody.js";
import { respond } from "../helpers/respond.js";
import { userService } from "./service.js";

export function homeRoute(_, res) {
    const message = 'Hello World!';
    return respond(res, 200, { message });
}

export function getUsers(_, res) {
    const users = userService.getAllUsers();
    return respond(res, 200, users);
}

export function getUserById(req, res) {
    const { id } = req.params;
    const user = userService.getUserById(Number(id));
    if (!user) return respond(res, 404, { error: 'User not Found' });
    return respond(res, 200, user);
}

export async function createUser(req, res) {
    try {
        const body = await parseRequestBody(req);
        const newUser = userService.createUser(body);
        return respond(res, 201, newUser);
    } catch (e) {
        return respond(res, 400, { message: e.message });
    }
}

export async function updateUserById(req, res) {
    try {
        const { id } = req.params;
        const body = await parseRequestBody(req);
        const updated = userService.updateUser(Number(id), body);
        if (!updated) return respond(res, 404, { error: 'User not Found' });
        return respond(res, 200, updated);
    } catch (e) {
        return respond(res, 400, { message: e.message });
    }
}

export function deleteUserById(req, res) {
    const { id } = req.params;
    userService.removeUser(Number(id));
    return respond(res, 204);
}