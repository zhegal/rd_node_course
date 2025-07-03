import { config } from "../config/index.js";
import { registry } from "../openapi/registry.js";
import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';

export const openApiDocument = new OpenApiGeneratorV3(registry.definitions).generateDocument({
    openapi: '3.0.0',
    info: {
        title: config.appName,
    },
    apis: ['./src/routes/**/*.js'],
});