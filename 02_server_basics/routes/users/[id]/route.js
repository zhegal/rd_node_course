import { BaseRoute } from "../../../lib/BaseRoute.js";
import { UsersService } from "../../../services/users.service.js";

export class Route extends BaseRoute {
    constructor(req, res, args) {
        super(req, res, args);
        this.service = new UsersService;
    }

    async GET() {
        const { id } = this.args;
        return await this.service.findById(Number(id));
    }

    async PATCH() {
        const { id } = this.args;
        const body = await this.getBody();
        return await this.service.updateById(Number(id), body);
    }

    async DELETE() {
        const { id } = this.args;
        this.service.deleteById(Number(id));
        this.res.statusCode = 204;
    }
}