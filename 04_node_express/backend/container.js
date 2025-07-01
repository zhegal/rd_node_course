import { createContainer, asClass } from "awilix";
import { BrewsController } from "./controllers/brews.controller.js";
import { BrewsModel } from "./models/brews.model.js";
import { BrewsService } from "./services/brews.service.js";
import { objectMap } from "./utils/Object.map.js";

const brewsModule = {
    brewsController: BrewsController,
    brewsService: BrewsService,
    brewsModel: BrewsModel,
};

export const container = createContainer({ injectionMode: 'CLASSIC' })
    .register(
        objectMap(brewsModule, value => asClass(value)[value.scope]()),
    );