import { BaseRoute } from "../lib/BaseRoute.js";

export class Route extends BaseRoute {
    async GET() {
        const message = 'Hello world!';
        return { message };
    }
}