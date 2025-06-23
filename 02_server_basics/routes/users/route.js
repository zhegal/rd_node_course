import { BaseRoute } from "../../lib/BaseRoute.js";
import { UsersService } from "../../services/users.service.js";

export class Route extends BaseRoute {
    constructor(req, res, args) {
        super(req, res, args);
        this.service = new UsersService;
    }

    async GET() {
        return this.service.getAll();
    }

    async POST() {
        const body = await this.getBody();
        const user = this.service.create(body);
        this.res.statusCode = 201;
        return user;
    }
}